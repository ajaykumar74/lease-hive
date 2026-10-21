import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PopoverModule } from 'primeng/popover';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { PermissionService } from '@/shared/security/permission.service';
import { DocumentAttachmentService } from '@/shared/document-attachments/document-attachment.service';
import { AiAskMode, AiAskRequest, AiAskResponse, AiSource } from './ai-assistant.models';
import { AiAssistantService } from './ai-assistant.service';

@Component({
    selector: 'app-ai-assistant',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        ButtonModule,
        DropdownModule,
        InputNumberModule,
        PopoverModule,
        TextareaModule,
        TooltipModule
    ],
    templateUrl: './ai-assistant.component.html'
})
export class AiAssistantComponent {
    readonly maxQuestionLength = 4000;
    readonly modeOptions: Array<{ label: string; value: AiAskMode }> = [
        { label: 'Auto', value: 'AUTO' },
        { label: 'Database', value: 'DATABASE' },
        { label: 'Document', value: 'DOCUMENT' }
    ];
    readonly form: FormGroup;

    conversationTurns: AiConversationTurn[] = [];
    asking = false;
    private conversationId: string | null = this.createConversationId();

    constructor(
        formBuilder: FormBuilder,
        private readonly aiAssistantService: AiAssistantService,
        private readonly documentAttachmentService: DocumentAttachmentService,
        private readonly permissionService: PermissionService
    ) {
        this.form = formBuilder.group({
            Mode: ['AUTO' as AiAskMode, [Validators.required]],
            Question: ['', [Validators.required, Validators.maxLength(this.maxQuestionLength)]],
            DocumentId: [null as number | null, [Validators.min(1)]]
        });
    }

    get canAsk(): boolean {
        return this.permissionService.hasPermission('ai.aiassistant.ask');
    }

    get mode(): AiAskMode {
        return this.form.get('Mode')?.value as AiAskMode;
    }

    get questionLength(): number {
        return (this.form.get('Question')?.value as string | null)?.length ?? 0;
    }

    get isDocumentMode(): boolean {
        return this.mode === 'DOCUMENT';
    }

    onModeChange(): void {
        if (!this.isDocumentMode) {
            this.form.patchValue({ DocumentId: null });
        }
    }

    ask(): void {
        if (this.form.invalid || this.asking || !this.canAsk) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const question = (value.Question as string).trim();
        if (!question) {
            this.form.get('Question')?.setErrors({ required: true });
            this.form.get('Question')?.markAsTouched();
            return;
        }

        const turn: AiConversationTurn = {
            id: this.createTurnId(),
            question,
            mode: value.Mode as AiAskMode,
            documentId: this.isDocumentMode ? value.DocumentId as number | null : null
        };
        const request: AiAskRequest = {
            ConversationId: this.conversationId,
            Mode: turn.mode,
            Question: turn.question,
            DocumentId: turn.documentId
        };

        this.asking = true;
        this.conversationTurns.push(turn);
        this.form.patchValue({ Question: '' });
        this.form.get('Question')?.markAsPristine();
        this.form.get('Question')?.markAsUntouched();
        this.aiAssistantService.ask(request).subscribe({
            next: response => {
                turn.response = response;
                this.conversationId = response.ConversationId ?? this.conversationId;
            },
            error: error => {
                turn.error = typeof error === 'string' ? error : 'The AI assistant could not process this question.';
                this.asking = false;
            },
            complete: () => this.asking = false
        });
    }

    newConversation(): void {
        this.conversationId = this.createConversationId();
        this.conversationTurns = [];
        this.form.patchValue({ Mode: 'AUTO', Question: '', DocumentId: null });
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    isDocumentSource(source: AiSource): boolean {
        return source.SourceType === 'DOCUMENT'
            && !!source.DocumentId
            && !!source.OwnerId
            && !!source.OwnerType;
    }

    downloadDocumentSource(turn: AiConversationTurn, source: AiSource): void {
        if (!this.isDocumentSource(source) || !source.DocumentId || !source.OwnerId || !source.OwnerType) {
            return;
        }

        turn.sourceError = '';
        this.documentAttachmentService.download(source.OwnerType, source.OwnerId, source.DocumentId).subscribe({
            next: (file) => {
                const url = URL.createObjectURL(file);
                const link = window.document.createElement('a');
                link.href = url;
                link.download = `document-${source.DocumentId}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
            },
            error: () => turn.sourceError = 'The cited document is no longer available to download.'
        });
    }

    trackByTurn(_: number, turn: AiConversationTurn): string {
        return turn.id;
    }

    modeLabel(mode: AiAskMode): string {
        return this.modeOptions.find(option => option.value === mode)?.label ?? mode;
    }

    formatAnswer(answer: string | null | undefined): string {
        return (answer ?? '')
            .replace(/\r\n?/g, '\n')
            .replace(/([:;])\s*-\s+(?=\S)/g, '$1\n• ')
            .replace(/([.!?])\s+-\s+(?=\S)/g, '$1\n• ')
            .replace(/([:;])\s*(\d+)\.\s+(?=\S)/g, '$1\n$2. ')
            .replace(/([.!?])\s+(\d+)\.\s+(?=\S)/g, '$1\n$2. ')
            .replace(/(^|\n)\s*[-*]\s+/g, '$1• ');
    }

    private createConversationId(): string | null {
        return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : null;
    }

    private createTurnId(): string {
        return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
}

interface AiConversationTurn {
    id: string;
    question: string;
    mode: AiAskMode;
    documentId: number | null;
    response?: AiAskResponse;
    error?: string;
    sourceError?: string;
}
