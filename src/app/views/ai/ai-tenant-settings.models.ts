export interface AiTenantSettings {
    IsEnabled: boolean;
    ProviderCode: string;
    ChatModelCode: string;
    EmbeddingModelCode: string | null;
    MonthlyRequestLimit: number | null;
    MonthlyTokenLimit: number | null;
    MonthlyBudgetUsd: number | null;
    MaxOutputTokens: number;
    EffectiveFrom: string | null;
    EffectiveTo: string | null;
    RowVersionStr: string | null;
    SupportedProviderCodes: string[];
    SupportedChatModelCodes: string[];
    SupportedEmbeddingModelCodes: string[];
}

export interface UpdateAiTenantSettings {
    IsEnabled: boolean;
    ProviderCode: string;
    ChatModelCode: string;
    EmbeddingModelCode: string | null;
    MonthlyRequestLimit: number | null;
    MonthlyTokenLimit: number | null;
    MonthlyBudgetUsd: number | null;
    MaxOutputTokens: number;
    EffectiveFrom: string | null;
    EffectiveTo: string | null;
    RowVersionStr: string | null;
}
