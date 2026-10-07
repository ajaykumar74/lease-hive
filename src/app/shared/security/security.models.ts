export interface UserSecurityContext {
    userId: number;
    tenantId: number;
    userCode?: string;
    permissions: string[];
}

export interface UserSecurityContextResponse {
    UserId: number;
    TenantId: number;
    UserCode?: string;
    Permissions: string[];
}
