import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { LoggedInUserService } from '@/shared/LoggedInUserService';
import {
    PlatformSettingDefinition,
    PlatformSettingDefinitionInput,
    UpdatePlatformSettingDefinition
} from './platform-settings.models';
import { PlatformSettingsService } from './platform-settings.service';

@Component({
    selector: 'app-platform-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TableModule,
        TextareaModule,
        ToastModule,
        ToggleSwitchModule
    ],
    providers: [MessageService],
    templateUrl: './platform-settings.component.html',
    styleUrl: './platform-settings.component.scss'
})
export class PlatformSettingsComponent implements OnInit {
    readonly dataTypes = ['Boolean', 'Integer', 'String', 'Select', 'LongText'];
    definitions: PlatformSettingDefinition[] = [];
    selectedDefinition: PlatformSettingDefinition | null = null;
    loading = true;
    saving = false;
    dialogVisible = false;
    error = '';
    readonly form: FormGroup;

    constructor(
        formBuilder: FormBuilder,
        private readonly settingsService: PlatformSettingsService,
        private readonly loggedInUserService: LoggedInUserService,
        private readonly messages: MessageService
    ) {
        this.form = formBuilder.group({
            SettingKey: ['', [Validators.required, Validators.maxLength(100)]],
            SettingName: ['', [Validators.required, Validators.maxLength(100)]],
            CategoryCode: ['', [Validators.required, Validators.maxLength(30)]],
            DataType: ['Boolean', [Validators.required]],
            DefaultValue: [null, [Validators.maxLength(500)]],
            OptionsJson: [null, [Validators.maxLength(2000)]],
            Description: [null, [Validators.maxLength(500)]],
            IsTenantEditable: [true],
            IsActive: [true]
        });
    }

    get isPlatformAdmin(): boolean {
        return this.loggedInUserService.isPlatformAdmin;
    }

    get isSelect(): boolean {
        return this.form.get('DataType')?.value === 'Select';
    }

    ngOnInit(): void {
        if (!this.isPlatformAdmin) {
            this.loading = false;
            this.error = 'Platform Settings is available only to Platform Administrators.';
            return;
        }
        this.load();
    }

    load(): void {
        this.loading = true;
        this.error = '';
        this.settingsService.getDefinitions().subscribe({
            next: definitions => this.definitions = this.sort(definitions),
            error: error => this.error = this.errorMessage(error, 'Platform settings could not be loaded.'),
            complete: () => this.loading = false
        });
    }

    openCreate(): void {
        this.selectedDefinition = null;
        this.form.reset({
            SettingKey: '',
            SettingName: '',
            CategoryCode: '',
            DataType: 'Boolean',
            DefaultValue: null,
            OptionsJson: null,
            Description: null,
            IsTenantEditable: true,
            IsActive: true
        });
        this.form.get('SettingKey')?.enable({ emitEvent: false });
        this.form.get('DataType')?.enable({ emitEvent: false });
        this.dialogVisible = true;
        this.error = '';
    }

    openEdit(definition: PlatformSettingDefinition): void {
        this.selectedDefinition = definition;
        this.form.reset({
            SettingKey: definition.SettingKey,
            SettingName: definition.SettingName,
            CategoryCode: definition.CategoryCode,
            DataType: definition.DataType,
            DefaultValue: definition.DefaultValue,
            OptionsJson: definition.OptionsJson,
            Description: definition.Description,
            IsTenantEditable: definition.IsTenantEditable,
            IsActive: definition.IsActive
        });
        this.form.get('SettingKey')?.disable({ emitEvent: false });
        this.form.get('DataType')?.disable({ emitEvent: false });
        this.dialogVisible = true;
        this.error = '';
    }

    save(): void {
        if (this.form.invalid || this.saving) {
            this.form.markAllAsTouched();
            return;
        }

        const input = this.toInput();
        this.saving = true;
        this.error = '';
        const request = this.selectedDefinition
            ? this.settingsService.updateDefinition(this.selectedDefinition.Id, {
                ...input,
                RowVersionStr: this.selectedDefinition.RowVersionStr
            } as UpdatePlatformSettingDefinition)
            : this.settingsService.createDefinition(input);

        request.subscribe({
            next: saved => {
                this.definitions = this.sort(this.selectedDefinition
                    ? this.definitions.map(definition => definition.Id === saved.Id ? saved : definition)
                    : [...this.definitions, saved]);
                this.dialogVisible = false;
                this.messages.add({ severity: 'success', summary: 'Platform setting saved', detail: `${saved.SettingName} has been saved to the settings catalog.` });
            },
            error: error => {
                this.error = this.errorMessage(error, 'Platform setting could not be saved.');
                this.messages.add({ severity: 'error', summary: 'Save failed', detail: this.error });
            },
            complete: () => this.saving = false
        });
    }

    private toInput(): PlatformSettingDefinitionInput {
        const value = this.form.getRawValue();
        return {
            SettingKey: String(value.SettingKey ?? '').trim(),
            SettingName: String(value.SettingName ?? '').trim(),
            CategoryCode: String(value.CategoryCode ?? '').trim(),
            DataType: String(value.DataType ?? '').trim(),
            DefaultValue: this.optional(value.DefaultValue),
            OptionsJson: this.isSelect ? this.optional(value.OptionsJson) : null,
            Description: this.optional(value.Description),
            IsTenantEditable: value.IsTenantEditable === true,
            IsActive: value.IsActive === true
        };
    }

    private optional(value: unknown): string | null {
        const normalized = String(value ?? '').trim();
        return normalized || null;
    }

    private sort(definitions: PlatformSettingDefinition[]): PlatformSettingDefinition[] {
        return [...definitions].sort((left, right) =>
            `${left.CategoryCode}|${left.SettingName}`.localeCompare(`${right.CategoryCode}|${right.SettingName}`, undefined, { sensitivity: 'base' }));
    }

    private errorMessage(error: unknown, fallback: string): string {
        if (typeof error === 'string') return error;
        if (typeof error === 'object' && error !== null) {
            const candidate = error as { message?: string; Message?: string; error?: { message?: string; Message?: string } };
            return candidate.message ?? candidate.Message ?? candidate.error?.message ?? candidate.error?.Message ?? fallback;
        }
        return fallback;
    }
}
