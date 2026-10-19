import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
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
        TextareaModule
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

    response: AiAskResponse | null = null;
    error = '';
    sourceError = '';
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

    onModeChange(): void {
        if (this.mode === 'DATABASE') {
            this.form.patchValue({ DocumentId: null });
        }
    }

    ask(): void {
        if (this.form.invalid || this.asking || !this.canAsk) {
            this.form.markAllAsTouched();
            return;
        }

        const value = this.form.getRawValue();
        const request: AiAskRequest = {
            ConversationId: this.conversationId,
            Mode: value.Mode as AiAskMode,
            Question: (value.Question as string).trim(),
            DocumentId: value.DocumentId as number | null
        };

        this.asking = true;
        this.error = '';
        this.sourceError = '';
        this.response = null;
        this.aiAssistantService.ask(request).subscribe({
            next: response => {
                this.response = response;
                this.conversationId = response.ConversationId ?? this.conversationId;
            },
            error: error => {
                this.error = typeof error === 'string' ? error : 'The AI assistant could not process this question.';
                this.asking = false;
            },
            complete: () => this.asking = false
        });
    }

    newConversation(): void {
        this.conversationId = this.createConversationId();
        this.response = null;
        this.error = '';
        this.sourceError = '';
        this.form.patchValue({ Question: '', DocumentId: null });
        this.form.markAsPristine();
        this.form.markAsUntouched();
    }

    isDocumentSource(source: AiSource): boolean {
        return source.SourceType === 'DOCUMENT'
            && !!source.DocumentId
            && !!source.OwnerId
            && !!source.OwnerType;
    }

    downloadDocumentSource(source: AiSource): void {
        if (!this.isDocumentSource(source) || !source.DocumentId || !source.OwnerId || !source.OwnerType) {
            return;
        }

        this.sourceError = '';
        this.documentAttachmentService.download(source.OwnerType, source.OwnerId, source.DocumentId).subscribe({
            next: (file) => {
                const url = URL.createObjectURL(file);
                const link = window.document.createElement('a');
                link.href = url;
                link.download = `document-${source.DocumentId}.pdf`;
                link.click();
                URL.revokeObjectURL(url);
            },
            error: () => this.sourceError = 'The cited document is no longer available to download.'
        });
    }

    private createConversationId(): string | null {
        return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : null;
    }
}
