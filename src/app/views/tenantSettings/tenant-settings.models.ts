export interface TenantSettingsResponse {
    Categories: TenantSettingsCategory[];
    CanUpdate: boolean;
    CanManageAutomation: boolean;
}

export interface TenantSettingsCategory {
    CategoryCode: string;
    CategoryName: string;
    Settings: TenantSetting[];
}

export interface TenantSetting {
    SettingDefinitionId: number;
    TenantSettingId: number;
    SettingKey: string;
    SettingName: string;
    CategoryCode: string;
    DataType: 'Boolean' | 'Integer' | 'String' | 'Select' | 'LongText' | string;
    DefaultValue: string | null;
    OptionsJson: string | null;
    Description: string | null;
    IsTenantEditable: boolean;
    IsEditable: boolean;
    SettingValue: string | null;
    RowVersionStr: string | null;
}

export interface TenantSettingValueUpdate {
    SettingKey: string;
    SettingValue: string | null;
    RowVersionStr: string;
}

export interface UpdateTenantSettingsRequest {
    Settings: TenantSettingValueUpdate[];
}

export interface RecurringBillingSystemUser {
    ApplicationUserId: number;
    DisplayName: string;
    UserName: string;
}
