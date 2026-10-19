import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { AiTenantSettings, UpdateAiTenantSettings } from './ai-tenant-settings.models';
import { AiTenantSettingsService } from './ai-tenant-settings.service';
import { PermissionService } from '@/shared/security/permission.service';

@Component({
    selector: 'app-ai-tenant-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        DropdownModule,
        InputNumberModule,
        InputTextModule
    ],
    templateUrl: './ai-tenant-settings.component.html'
})
export class AiTenantSettingsComponent implements OnInit {
    readonly form: FormGroup;

    settings: AiTenantSettings | null = null;
    loading = true;
    saving = false;
    error = '';
    message = '';

    constructor(
        formBuilder: FormBuilder,
        private readonly settingsService: AiTenantSettingsService,
        private readonly permissionService: PermissionService
    ) {
        this.form = formBuilder.group({
            IsEnabled: [false],
            ProviderCode: ['', [Validators.required, Validators.maxLength(50)]],
            ChatModelCode: ['', [Validators.required, Validators.maxLength(100)]],
            EmbeddingModelCode: [null as string | null, [Validators.maxLength(100)]],
            MonthlyRequestLimit: [null as number | null, [Validators.min(0)]],
            MonthlyTokenLimit: [null as number | null, [Validators.min(0)]],
            MonthlyBudgetUsd: [null as number | null, [Validators.min(0)]],
            MaxOutputTokens: [1024, [Validators.required, Validators.min(1), Validators.max(4096)]],
            EffectiveFrom: [null as string | null],
            EffectiveTo: [null as string | null]
        });
    }

    get canUpdate(): boolean {
        return this.permissionService.hasPermission('ai.aitenantsettings.update');
    }

    get providerCodes(): string[] {
        return this.settings?.SupportedProviderCodes ?? [];
    }

    get chatModelCodes(): string[] {
        return this.settings?.SupportedChatModelCodes ?? [];
    }

    get embeddingModelCodes(): string[] {
        return this.settings?.SupportedEmbeddingModelCodes ?? [];
    }

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;
        this.error = '';
        this.settingsService.get().subscribe({
            next: settings => {
                this.settings = settings;
                this.form.patchValue({
                    IsEnabled: settings.IsEnabled,
                    ProviderCode: settings.ProviderCode,
                    ChatModelCode: settings.ChatModelCode,
                    EmbeddingModelCode: settings.EmbeddingModelCode,
                    MonthlyRequestLimit: settings.MonthlyRequestLimit,
                    MonthlyTokenLimit: settings.MonthlyTokenLimit,
                    MonthlyBudgetUsd: settings.MonthlyBudgetUsd,
                    MaxOutputTokens: settings.MaxOutputTokens,
                    EffectiveFrom: settings.EffectiveFrom,
                    EffectiveTo: settings.EffectiveTo
                });
            },
            error: error => this.error = typeof error === 'string' ? error : 'AI settings could not be loaded.',
            complete: () => this.loading = false
        });
    }

    save(): void {
        if (this.form.invalid || !this.settings || !this.canUpdate) {
            this.form.markAllAsTouched();
            return;
        }

        this.saving = true;
        this.error = '';
        this.message = '';
        const value = this.form.getRawValue();
        const request: UpdateAiTenantSettings = {
            ...value,
            EmbeddingModelCode: value.EmbeddingModelCode || null,
            RowVersionStr: this.settings.RowVersionStr
        };
        this.settingsService.update(request).subscribe({
            next: settings => {
                this.settings = settings;
                this.message = 'AI tenant settings were saved.';
                this.form.patchValue(settings);
            },
            error: error => this.error = typeof error === 'string' ? error : 'AI settings could not be saved.',
            complete: () => this.saving = false
        });
    }
}
