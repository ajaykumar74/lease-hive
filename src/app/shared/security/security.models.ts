export interface UserSecurityContext {
    userId: number;
    tenantId: number;
    userCode?: string;
    permissions: string[];
    tenantContext?: TenantContext;
    isPlatformAdministrator?: boolean;
}

export interface TenantContext {
    TenantId: number;
    TenantName: string;
    TenantStatus: string;
    SubscriptionStatus?: string;
    PlanCode?: string;
    PlanName?: string;
    MaxUsers?: number;
    MaxAssets?: number;
    StorageGB?: number;
    ActiveUsers: number;
    ActiveAssets: number;
    FeatureCodes: string[];
    ActiveAssetCategoryCodes: string[];
}

export interface UserSecurityContextResponse {
    UserId: number;
    TenantId: number;
    UserCode?: string;
    Permissions: string[];
    TenantContext?: TenantContext;
    IsPlatformAdministrator?: boolean;
}
