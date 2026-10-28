export interface DocumentTemplate {
    Id: number;
    TenantId: number;
    IsSystemTemplate: boolean;
    DocumentTemplateId: string;
    TemplateCode: string;
    TemplateName: string;
    TemplateTypeCode: string;
    AssetCategoryId: number | null;
    AssetCategoryName: string | null;
    DocumentId: number;
    DocumentVersionId: number;
    DocumentVersionNumber: number;
    OriginalFileName: string;
    UploadedAtUtc: string | null;
    IsDefault: boolean;
    EffectiveFrom: string;
    EffectiveTo: string | null;
    RecordStatus: 'Active' | 'Inactive';
}

export interface DocumentTemplateSaveRequest {
    TemplateCode: string;
    TemplateName: string;
    TemplateTypeCode: string;
    AssetCategoryId: number | null;
    IsDefault: boolean;
    EffectiveFrom: string;
    EffectiveTo: string | null;
    RecordStatus: 'Active' | 'Inactive';
}

export interface DocumentTemplateOption {
    Id: number;
    Code: string;
    Name: string;
}

export interface DocumentTemplateOptions {
    TemplateTypeCodes: string[];
    AssetCategories: DocumentTemplateOption[];
}

export interface DocumentTemplateValidationResult {
    IsValid: boolean;
    Variables: string[];
    MissingVariables: string[];
    UnsupportedTokens: string[];
    StructuralErrors: string[];
}
