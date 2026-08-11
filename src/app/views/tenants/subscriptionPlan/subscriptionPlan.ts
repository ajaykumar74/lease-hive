import { IBase } from "@/shared/IBase";

export interface ISubscriptionPlan extends IBase {
	Id :number;
PlanCode :string;
PlanName :string;
MaxUsers :number;
MaxAssets :number;
StorageGB :number;
Description :string;
IsDeleted : boolean;

}