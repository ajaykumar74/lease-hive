export interface AiUsageCurrencyTotal {
    CurrencyCode: string;
    CostAmount: number;
}

export interface AiUsagePeriod {
    RequestCount: number;
    SucceededRequestCount: number;
    CancelledRequestCount: number;
    DeniedRequestCount: number;
    TimedOutRequestCount: number;
    CachedRequestCount: number;
    FailedRequestCount: number;
    InputTokenCount: number;
    OutputTokenCount: number;
    CachedTokenCount: number;
    TotalTokenCount: number;
    ErrorRatePercent: number;
    DenialRatePercent: number;
}

export interface AiUsageTimingPercentiles {
    P50EndToEndMilliseconds: number;
    P95EndToEndMilliseconds: number;
}

export interface AiUsageLimits {
    HasEffectivePolicy: boolean;
    HardLimitEnabled: boolean;
    SoftLimitWarningThresholdPercent: number;
    MonthlyTokenLimit: number;
    MonthlySpendLimit: number;
    MonthlySpendCurrencyCode: string;
    RequestsPerMinuteLimit: number;
    MaxConcurrentRequests: number;
    MaxResponseTokens: number;
    CurrentMonthConsumedTokenCount: number;
    CurrentMonthReservedTokenCount: number;
    CurrentMonthConsumedSpendAmount: number;
    CurrentMonthReservedSpendAmount: number;
    CurrentMonthCurrencyCode: string;
    ActiveRequestCount: number;
}

export interface AiUsageFeatureBreakdown {
    FeatureCode: string;
    Usage: AiUsagePeriod;
    EstimatedCosts: AiUsageCurrencyTotal[];
}

export interface AiUsageDashboard {
    FromUtc: string;
    ToExclusiveUtc: string;
    CurrentPeriod: AiUsagePeriod;
    Timing: AiUsageTimingPercentiles;
    EstimatedCosts: AiUsageCurrencyTotal[];
    Limits: AiUsageLimits;
    Features: AiUsageFeatureBreakdown[];
}

export interface AiUsageMetadataEntry {
    OccurredAtUtc: string;
    CorrelationId: string;
    FeatureCode: string;
    ProviderCode: string;
    ModelCode: string;
    MeteringSourceCode: string;
    PricingSourceCode: string;
    PricingVersion: string;
    CurrencyCode: string;
    StatusCode: string;
    FailureCode?: string;
    InputTokenCount: number;
    OutputTokenCount: number;
    CachedTokenCount: number;
    TotalTokenCount: number;
    QueueDurationMilliseconds: number;
    PolicyDurationMilliseconds: number;
    ToolOrDatabaseDurationMilliseconds: number;
    ModelDurationMilliseconds: number;
    EndToEndDurationMilliseconds: number;
    CostAmount: number;
}

export interface AiUsageMetadataPage {
    FromUtc: string;
    ToExclusiveUtc: string;
    FeatureCode?: string;
    StatusCode?: string;
    PageNumber: number;
    PageSize: number;
    TotalCount: number;
    Entries: AiUsageMetadataEntry[];
}
