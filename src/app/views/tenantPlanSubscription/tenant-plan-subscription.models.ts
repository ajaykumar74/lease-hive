export interface TenantPlanSubscriptionSnapshot {
    Plan: TenantPlan | null;
    Subscription: TenantSubscription | null;
    Usage: TenantUsage | null;
    Features: TenantPlanFeature[];
    Settings: TenantPlanSetting[];
}

export interface TenantPlan {
    PlanCode: string;
    PlanName: string;
    MaxUsers: number;
    MaxAssets: number;
    StorageGB: number;
    Description: string | null;
}

export interface TenantSubscription {
    SubscriptionStatus: string;
    StartDate: string;
    EndDate: string | null;
}

export interface TenantUsage {
    ActiveUsers: number;
    ActiveAssets: number;
    AiRequestsThisMonth: number;
    LastCalculatedAt: string | null;
}

export interface TenantPlanFeature {
    FeatureCode: string;
    FeatureName: string;
}

export interface TenantPlanSetting {
    CategoryCode: string;
    SettingName: string;
    SettingValue: string;
    Description: string | null;
}
