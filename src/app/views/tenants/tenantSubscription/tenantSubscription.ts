import { IBase } from "@/shared/IBase";

export interface ITenantSubscription extends IBase {
	Id :number;
TenantId :number;
SubscriptionPlanId :number;
SubscriptionStatus :string;
StartDate :Date | string | null;
EndDate :Date | string | null;
TenantName?: string;
SubscriptionPlanName?: string;

}
