import { IBase } from "@/shared/IBase";

export interface ITenantUsage extends IBase {
	Id :number;
TenantId :number;
ActiveUsers :number;
ActiveAssets :number;
AiRequestsThisMonth :number;
LastCalculatedAt :Date | string | null;
TenantName?: string;

}
