export interface AiUsageQuery {
    FromUtc: string;
    ToUtc: string;
}

export interface AiUsageRequestQuery extends AiUsageQuery {
    PageNumber: number;
    PageSize: number;
}

export interface AiUsageDashboard {
    FromUtc: string;
    ToUtc: string;
    Summary: AiUsageSummary;
    CurrentMonthQuota: AiUsageQuota;
}

export interface AiUsageSummary {
    LogicalRequestCount: number;
    CompletedRequestCount: number;
    FailedRequestCount: number;
    DeniedRequestCount: number;
    ProviderCallCount: number;
    InputTokenCount: number;
    OutputTokenCount: number;
    CachedInputTokenCount: number;
    TotalTokenCount: number;
    UnknownTokenCallCount: number;
    EstimatedCostUsd: number | null;
    UnknownCostCallCount: number;
    AverageProviderDurationMs: number | null;
    DailyUsage: AiUsageDaily[];
    RequestTypeBreakdown: AiUsageBreakdown[];
    Failures: AiUsageFailure[];
}

export interface AiUsageQuota {
    IsEnabled: boolean;
    PeriodStartUtc: string;
    MonthlyRequestLimit: number | null;
    MonthlyTokenLimit: number | null;
    MonthlyBudgetUsd: number | null;
    RequestCount: number;
    TokenCount: number;
    CostUsd: number | null;
    UnknownCostCount: number;
    RemainingRequestCount: number | null;
    RemainingTokenCount: number | null;
    RemainingBudgetUsd: number | null;
}

export interface AiUsageDaily {
    UsageDateUtc: string;
    LogicalRequestCount: number;
    ProviderCallCount: number;
    TotalTokenCount: number;
    EstimatedCostUsd: number | null;
    FailedCallCount: number;
    DeniedRequestCount: number;
}

export interface AiUsageBreakdown {
    Name: string;
    Count: number;
}

export interface AiUsageFailure {
    ErrorCode: string;
    Count: number;
}

export interface AiUsageRequestPage {
    PageNumber: number;
    PageSize: number;
    TotalCount: number;
    Items: AiUsageRequest[];
}

export interface AiUsageRequest {
    RequestId: string;
    RequestedAtUtc: string;
    RequestType: string;
    ProviderCode: string;
    ModelCode: string;
    OutcomeStatus: string;
    ProviderCallCount: number;
    InputTokenCount: number;
    OutputTokenCount: number;
    CachedInputTokenCount: number;
    TotalTokenCount: number;
    UnknownTokenCallCount: number;
    EstimatedCostUsd: number | null;
    UnknownCostCallCount: number;
    TotalProviderDurationMs: number | null;
    ErrorCode: string | null;
}
