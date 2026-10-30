import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import {
    RecurringBillingSystemUser,
    TenantSetting,
    TenantSettingsCategory,
    TenantSettingsResponse,
    UpdateTenantSettingsRequest
} from './tenant-settings.models';
import { TenantSettingsService } from './tenant-settings.service';

interface SettingsNavigationItem {
    code: string;
    label: string;
    icon: string;
    description: string;
}

@Component({
    selector: 'app-tenant-settings',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        SelectModule,
        TextareaModule,
        ToastModule,
        ToggleSwitchModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './tenant-settings.component.html',
    styleUrl: './tenant-settings.component.scss'
})
export class TenantSettingsComponent implements OnInit {
    readonly categories: SettingsNavigationItem[] = [
        { code: 'General', label: 'General', icon: 'pi-cog', description: 'Core tenant preferences' },
        { code: 'Billing', label: 'Billing & Automation', icon: 'pi-receipt', description: 'Billing runs and automation' },
        { code: 'Finance', label: 'Finance & Receivables', icon: 'pi-wallet', description: 'Payments and reconciliation' },
        { code: 'LeaseManagement', label: 'Lease Management', icon: 'pi-file-edit', description: 'Lease workflow preferences' },
        { code: 'Documents', label: 'Documents', icon: 'pi-folder', description: 'Generation and storage defaults' },
        { code: 'UI', label: 'UI & Appearance', icon: 'pi-palette', description: 'Display and workspace preferences' },
        { code: 'Notifications', label: 'Notifications', icon: 'pi-bell', description: 'Delivery and recipient preferences' },
        { code: 'RegionalCompliance', label: 'Regional & Compliance', icon: 'pi-globe', description: 'Regional operating preferences' },
        { code: 'Integrations', label: 'Integrations', icon: 'pi-link', description: 'Connected-system preferences' }
    ];

    form: FormGroup;
    response: TenantSettingsResponse | null = null;
    activeCategoryCode = 'Billing';
    loading = true;
    saving = false;
    resetting = false;
    systemUsersLoading = false;
    systemUsersLoaded = false;
    error = '';
    eligibleSystemUsers: RecurringBillingSystemUser[] = [];

    private readonly originalValues = new Map<string, unknown>();

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly settingsService: TenantSettingsService,
        private readonly messages: MessageService
    ) {
        this.form = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.load();
    }

    get activeCategory(): SettingsNavigationItem {
        return this.categories.find(category => category.code === this.activeCategoryCode) ?? this.categories[0];
    }

    get activeSettings(): TenantSetting[] {
        return this.response?.Categories
            .find(category => category.CategoryCode.toLowerCase() === this.activeCategoryCode.toLowerCase())
            ?.Settings ?? [];
    }

    get canUpdate(): boolean {
        return this.response?.CanUpdate === true;
    }

    get hasEditableSettings(): boolean {
        return this.activeSettings.some(setting => this.isSettingEditable(setting));
    }

    load(): void {
        this.loading = true;
        this.error = '';
        this.settingsService.getAll().subscribe({
            next: response => {
                this.response = response;
                this.addControls(response.Categories);
                this.ensureAvailableCategory();
                this.loadSystemUsersWhenRequired();
            },
            error: error => this.error = this.errorMessage(error, 'Tenant settings could not be loaded.'),
            complete: () => this.loading = false
        });
    }

    selectCategory(category: SettingsNavigationItem): void {
        this.activeCategoryCode = category.code;
        this.error = '';
        this.loadSystemUsersWhenRequired();
    }

    save(): void {
        if (!this.canUpdate || this.saving || this.resetting) return;

        const changedSettings = this.activeSettings.filter(setting => this.hasChanged(setting));
        if (changedSettings.length === 0) {
            this.messages.add({ severity: 'info', summary: 'No changes', detail: 'There are no changes to save in this category.' });
            return;
        }

        if (changedSettings.some(setting => !this.isSettingEditable(setting))) {
            this.error = 'One or more selected settings cannot be changed with your current permissions.';
            return;
        }

        if (this.form.invalid) {
            changedSettings.forEach(setting => this.control(setting).markAsTouched());
            this.error = 'Correct the highlighted values before saving.';
            return;
        }

        const request: UpdateTenantSettingsRequest = {
            Settings: changedSettings.map(setting => ({
                SettingKey: setting.SettingKey,
                SettingValue: this.toApiValue(setting, this.control(setting).value),
                RowVersionStr: setting.RowVersionStr ?? ''
            }))
        };

        this.saving = true;
        this.error = '';
        this.settingsService.update(request).subscribe({
            next: response => {
                this.mergeResponse(response, new Set(changedSettings.map(setting => setting.SettingKey)));
                this.messages.add({ severity: 'success', summary: 'Settings saved', detail: 'Your tenant settings have been updated.' });
            },
            error: error => {
                this.error = this.errorMessage(error, 'Tenant settings could not be saved.');
                this.messages.add({ severity: 'error', summary: 'Settings not saved', detail: this.error });
            },
            complete: () => this.saving = false
        });
    }

    resetToDefaults(): void {
        if (!this.canUpdate || this.resetting || this.saving || !this.hasEditableSettings) return;
        if (!window.confirm(`Reset editable ${this.activeCategory.label} settings to their defaults?`)) return;

        this.resetting = true;
        this.error = '';
        this.settingsService.reset(this.activeCategoryCode).subscribe({
            next: response => {
                this.mergeResponse(response);
                this.messages.add({ severity: 'success', summary: 'Defaults restored', detail: 'Editable settings in this category were reset.' });
            },
            error: error => {
                this.error = this.errorMessage(error, 'Tenant settings could not be reset.');
                this.messages.add({ severity: 'error', summary: 'Reset failed', detail: this.error });
            },
            complete: () => this.resetting = false
        });
    }

    isBoolean(setting: TenantSetting): boolean { return setting.DataType.toLowerCase() === 'boolean'; }
    isInteger(setting: TenantSetting): boolean { return setting.DataType.toLowerCase() === 'integer' && !this.isSystemUser(setting); }
    isSelect(setting: TenantSetting): boolean { return setting.DataType.toLowerCase() === 'select'; }
    isLongText(setting: TenantSetting): boolean { return setting.DataType.toLowerCase() === 'longtext'; }
    isSystemUser(setting: TenantSetting): boolean { return setting.SettingKey === 'RecurringBilling.SystemUserId'; }

    isSettingEditable(setting: TenantSetting): boolean {
        if (!this.canUpdate || !setting.IsEditable) return false;
        if (setting.SettingKey === 'RecurringBilling.Enabled' || this.isSystemUser(setting)) {
            return this.systemUsersLoaded && !this.systemUsersLoading && this.eligibleSystemUsers.length > 0;
        }
        return true;
    }

    settingOptions(setting: TenantSetting): string[] {
        if (!setting.OptionsJson) return [];
        try {
            const parsed: unknown = JSON.parse(setting.OptionsJson);
            return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
        } catch {
            return [];
        }
    }

    control(setting: TenantSetting): FormControl {
        return this.form.get(this.controlName(setting)) as FormControl;
    }

    controlName(setting: TenantSetting): string {
        return setting.SettingKey.replace(/[^a-zA-Z0-9]/g, '_');
    }

    private addControls(categories: TenantSettingsCategory[]): void {
        categories.flatMap(category => category.Settings).forEach(setting => {
            const name = this.controlName(setting);
            const value = this.toControlValue(setting);
            if (!this.form.contains(name)) {
                this.form.addControl(name, new FormControl(value, this.validatorsFor(setting)));
            } else {
                this.form.get(name)?.setValue(value, { emitEvent: false });
            }
            this.originalValues.set(setting.SettingKey, value);
        });
    }

    private mergeResponse(response: TenantSettingsResponse, settingKeys?: Set<string>): void {
        if (!this.response) {
            this.response = response;
            this.addControls(response.Categories);
            return;
        }

        this.response = {
            ...this.response,
            CanUpdate: response.CanUpdate,
            CanManageAutomation: response.CanManageAutomation,
            Categories: this.response.Categories.map(currentCategory => {
                const returnedCategory = response.Categories.find(category => category.CategoryCode.toLowerCase() === currentCategory.CategoryCode.toLowerCase());
                if (!returnedCategory) return currentCategory;
                return {
                    ...currentCategory,
                    CategoryName: returnedCategory.CategoryName,
                    Settings: currentCategory.Settings.map(currentSetting => {
                        const returnedSetting = returnedCategory.Settings.find(setting => setting.SettingKey === currentSetting.SettingKey);
                        if (!returnedSetting || (settingKeys && !settingKeys.has(currentSetting.SettingKey))) return currentSetting;
                        this.updateControl(returnedSetting);
                        return returnedSetting;
                    })
                };
            })
        };
    }

    private updateControl(setting: TenantSetting): void {
        const value = this.toControlValue(setting);
        this.control(setting)?.setValue(value, { emitEvent: false });
        this.control(setting)?.markAsPristine();
        this.originalValues.set(setting.SettingKey, value);
    }

    private hasChanged(setting: TenantSetting): boolean {
        return this.stableValue(this.control(setting).value) !== this.stableValue(this.originalValues.get(setting.SettingKey));
    }

    private toControlValue(setting: TenantSetting): string | number | boolean | null {
        if (this.isBoolean(setting)) return setting.SettingValue?.toLowerCase() === 'true';
        if (setting.DataType.toLowerCase() === 'integer') {
            return setting.SettingValue === null || setting.SettingValue === '' ? null : Number(setting.SettingValue);
        }
        return setting.SettingValue;
    }

    private toApiValue(setting: TenantSetting, value: unknown): string | null {
        if (value === null || value === undefined || value === '') return null;
        if (this.isBoolean(setting)) return value === true ? 'true' : 'false';
        return String(value);
    }

    private validatorsFor(setting: TenantSetting) {
        if (setting.DataType.toLowerCase() === 'integer') return [Validators.pattern(/^-?\d+$/)];
        return [Validators.maxLength(500)];
    }

    private ensureAvailableCategory(): void {
        if (this.activeSettings.length > 0) return;
        const firstConfigured = this.categories.find(category => this.categorySettings(category.code).length > 0);
        this.activeCategoryCode = firstConfigured?.code ?? this.categories[0].code;
    }

    private categorySettings(categoryCode: string): TenantSetting[] {
        return this.response?.Categories.find(category => category.CategoryCode.toLowerCase() === categoryCode.toLowerCase())?.Settings ?? [];
    }

    private loadSystemUsersWhenRequired(): void {
        if (this.systemUsersLoaded || this.systemUsersLoading || !this.activeSettings.some(setting => this.isSystemUser(setting))) return;
        this.systemUsersLoading = true;
        this.settingsService.getEligibleRecurringBillingSystemUsers().subscribe({
            next: users => this.eligibleSystemUsers = users,
            error: error => this.error = this.errorMessage(error, 'Eligible recurring-billing users could not be loaded.'),
            complete: () => {
                this.systemUsersLoading = false;
                this.systemUsersLoaded = true;
            }
        });
    }

    private stableValue(value: unknown): string {
        return value === null || value === undefined ? '' : String(value);
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
