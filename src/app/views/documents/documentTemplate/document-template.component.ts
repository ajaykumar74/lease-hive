import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { finalize, forkJoin } from 'rxjs';
import { PermissionService } from '@/shared/security/permission.service';
import {
    DocumentTemplate,
    DocumentTemplateOptions,
    DocumentTemplateSaveRequest,
    DocumentTemplateValidationResult
} from './document-template.models';
import { DocumentTemplateService } from './document-template.service';

@Component({
    selector: 'app-document-template',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, CheckboxModule, DropdownModule, InputTextModule, TableModule, TagModule],
    templateUrl: './document-template.component.html',
    styleUrl: './document-template.component.css'
})
export class DocumentTemplateComponent implements OnInit {
    readonly form: FormGroup;
    templates: DocumentTemplate[] = [];
    options: DocumentTemplateOptions = { TemplateTypeCodes: [], AssetCategories: [] };
    selected: DocumentTemplate | null = null;
    selectedFile: File | null = null;
    validation: DocumentTemplateValidationResult | null = null;
    editorOpen = false;
    loading = true;
    busy = false;
    error = '';
    message = '';

    constructor(
        formBuilder: FormBuilder,
        private readonly templateService: DocumentTemplateService,
        private readonly permissionService: PermissionService
    ) {
        this.form = formBuilder.group({
            TemplateCode: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
            TemplateName: ['', [Validators.required, Validators.maxLength(100)]],
            TemplateTypeCode: ['', [Validators.required]],
            AssetCategoryId: [null as number | null],
            IsDefault: [false],
            EffectiveFrom: [this.today(), [Validators.required]],
            EffectiveTo: [null as string | null],
            RecordStatus: ['Active' as 'Active' | 'Inactive', [Validators.required]]
        });
    }

    get canCreate(): boolean { return this.permissionService.hasPermission('document.document.create'); }
    get canUpdate(): boolean { return this.permissionService.hasPermission('document.document.update'); }
    get canDownload(): boolean { return this.permissionService.hasPermission('document.document.download'); }
    get editingSystemTemplate(): boolean { return this.selected?.IsSystemTemplate === true; }
    get editorTitle(): string {
        if (!this.selected) return 'Create document template';
        return this.editingSystemTemplate ? 'System template details' : 'Edit document template';
    }

    ngOnInit(): void { this.load(); }

    load(): void {
        this.loading = true;
        this.error = '';
        forkJoin({ templates: this.templateService.list(), options: this.templateService.options() })
            .pipe(finalize(() => this.loading = false))
            .subscribe({
                next: result => {
                    this.templates = result.templates;
                    this.options = result.options;
                },
                error: error => this.error = this.errorText(error)
            });
    }

    newTemplate(): void {
        this.editorOpen = true;
        this.selected = null;
        this.selectedFile = null;
        this.validation = null;
        this.error = '';
        this.message = '';
        this.form.reset({
            TemplateCode: '', TemplateName: '', TemplateTypeCode: this.options.TemplateTypeCodes[0] || '',
            AssetCategoryId: null, IsDefault: false, EffectiveFrom: this.today(), EffectiveTo: null, RecordStatus: 'Active'
        });
    }

    select(template: DocumentTemplate): void {
        this.editorOpen = true;
        this.selected = template;
        this.selectedFile = null;
        this.validation = null;
        this.error = '';
        this.message = '';
        this.form.reset({
            TemplateCode: template.TemplateCode,
            TemplateName: template.TemplateName,
            TemplateTypeCode: template.TemplateTypeCode,
            AssetCategoryId: template.AssetCategoryId,
            IsDefault: template.IsDefault,
            EffectiveFrom: this.dateOnly(template.EffectiveFrom),
            EffectiveTo: template.EffectiveTo ? this.dateOnly(template.EffectiveTo) : null,
            RecordStatus: template.RecordStatus
        });
    }

    backToList(): void {
        if (this.busy) return;
        this.editorOpen = false;
        this.selected = null;
        this.selectedFile = null;
        this.validation = null;
        this.error = '';
        this.message = '';
    }

    chooseFile(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.selectedFile = input.files?.item(0) ?? null;
        if (this.selectedFile && !this.selectedFile.name.toLowerCase().endsWith('.docx')) {
            this.error = 'Select a .docx template file.';
            this.selectedFile = null;
        } else {
            this.error = '';
        }
    }

    save(): void {
        if (this.form.invalid || this.busy || this.editingSystemTemplate || (!this.selected && !this.selectedFile)) {
            this.form.markAllAsTouched();
            if (!this.selected && !this.selectedFile) this.error = 'Select a DOCX file before creating the template.';
            return;
        }
        const request = this.form.getRawValue() as DocumentTemplateSaveRequest;
        this.startAction();
        const operation = this.selected
            ? this.templateService.update(this.selected.Id, request)
            : this.templateService.create(request, this.selectedFile!);
        operation.pipe(finalize(() => this.busy = false)).subscribe({
            next: template => {
                this.upsert(template);
                this.selected = template;
                this.selectedFile = null;
                this.select(template);
                this.message = 'Document template saved.';
            },
            error: error => this.error = this.errorText(error)
        });
    }

    replaceFile(): void {
        if (!this.selected || !this.selectedFile || this.busy || this.editingSystemTemplate || !this.canUpdate) {
            if (!this.selectedFile) this.error = 'Choose a DOCX file to create a new version.';
            return;
        }
        this.startAction();
        this.templateService.replaceFile(this.selected.Id, this.selectedFile).pipe(finalize(() => this.busy = false)).subscribe({
            next: template => {
                this.upsert(template);
                this.selectedFile = null;
                this.select(template);
                this.message = `Version ${template.DocumentVersionNumber} is now current.`;
            },
            error: error => this.error = this.errorText(error)
        });
    }

    setDefault(): void {
        if (!this.selected || this.busy || this.editingSystemTemplate || !this.canUpdate) return;
        this.startAction();
        this.templateService.setDefault(this.selected.Id).pipe(finalize(() => this.busy = false)).subscribe({
            next: template => {
                this.upsert(template);
                this.selected = template;
                this.select(template);
                this.message = 'Default template updated for this scope.';
            },
            error: error => this.error = this.errorText(error)
        });
    }

    toggleStatus(): void {
        if (!this.selected || this.busy || this.editingSystemTemplate || !this.canUpdate) return;
        const status: 'Active' | 'Inactive' = this.selected.RecordStatus === 'Active' ? 'Inactive' : 'Active';
        this.startAction();
        this.templateService.setStatus(this.selected.Id, status).pipe(finalize(() => this.busy = false)).subscribe({
            next: template => {
                this.upsert(template);
                this.selected = template;
                this.select(template);
                this.message = `Template ${status.toLowerCase()}d.`;
            },
            error: error => this.error = this.errorText(error)
        });
    }

    validate(): void {
        if (!this.selected || this.busy) return;
        this.startAction();
        this.templateService.validate(this.selected.Id).pipe(finalize(() => this.busy = false)).subscribe({
            next: validation => {
                this.validation = validation;
                this.message = validation.IsValid ? 'Template validation passed.' : 'Template validation found items to correct.';
            },
            error: error => this.error = this.errorText(error)
        });
    }

    download(): void {
        if (!this.selected || this.busy || !this.canDownload) return;
        this.startAction();
        this.templateService.download(this.selected.Id).pipe(finalize(() => this.busy = false)).subscribe({
            next: file => this.openBlob(file, this.selected?.OriginalFileName || 'document-template.docx', false),
            error: error => this.error = this.errorText(error)
        });
    }

    preview(): void {
        if (!this.selected || this.busy) return;
        this.startAction();
        this.templateService.preview(this.selected.Id).pipe(finalize(() => this.busy = false)).subscribe({
            next: file => this.openBlob(file, `${this.selected?.TemplateCode || 'template'}-preview.pdf`, true),
            error: error => this.error = this.errorText(error)
        });
    }

    severity(status: string): 'success' | 'secondary' | 'warn' {
        return status === 'Active' ? 'success' : 'secondary';
    }

    private upsert(template: DocumentTemplate): void {
        const index = this.templates.findIndex(item => item.Id === template.Id);
        if (index >= 0) this.templates[index] = template;
        else this.templates = [template, ...this.templates];
        if (template.IsDefault) {
            this.templates = this.templates.map(item =>
                item.TenantId === template.TenantId &&
                item.TemplateTypeCode === template.TemplateTypeCode &&
                item.AssetCategoryId === template.AssetCategoryId
                    ? { ...item, IsDefault: item.Id === template.Id }
                    : item
            );
        }
        this.templates = [...this.templates];
    }

    private startAction(): void { this.busy = true; this.error = ''; this.message = ''; }
    private errorText(error: unknown): string { return typeof error === 'string' ? error : 'Document template action could not be completed.'; }
    private dateOnly(value: string): string { return value ? value.substring(0, 10) : ''; }
    private today(): string { return new Date().toISOString().substring(0, 10); }

    private openBlob(file: Blob, fileName: string, preview: boolean): void {
        const url = URL.createObjectURL(file);
        if (preview) {
            window.open(url, '_blank', 'noopener');
            window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
            this.message = 'Preview opened in a new tab.';
            return;
        }
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        this.message = 'Template download started.';
    }
}
