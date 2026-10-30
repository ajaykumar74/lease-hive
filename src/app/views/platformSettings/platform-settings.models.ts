export interface PlatformSettingDefinition {
    Id: number;
    SettingKey: string;
    SettingName: string;
    CategoryCode: string;
    DataType: 'Boolean' | 'Integer' | 'String' | 'Select' | 'LongText' | string;
    DefaultValue: string | null;
    OptionsJson: string | null;
    Description: string | null;
    IsTenantEditable: boolean;
    IsActive: boolean;
    RowVersionStr: string;
}

export interface PlatformSettingDefinitionInput {
    SettingKey: string;
    SettingName: string;
    CategoryCode: string;
    DataType: string;
    DefaultValue: string | null;
    OptionsJson: string | null;
    Description: string | null;
    IsTenantEditable: boolean;
    IsActive: boolean;
}

export interface UpdatePlatformSettingDefinition extends PlatformSettingDefinitionInput {
    RowVersionStr: string;
}
