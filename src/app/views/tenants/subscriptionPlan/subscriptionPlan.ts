import { IBase } from "@/shared/IBase";

export interface ISubscriptionPlan extends IBase {
	Id :number;
SubscriptionPlanId :string;
PlanCode :string;
PlanName :string;
MaxUsers :number;
MaxAssets :number;
StorageGB :number;
Description :string;
IsDeleted : boolean;

}
