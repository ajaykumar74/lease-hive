import { IBase } from "@/shared/IBase";

export interface IInsuranceClaimStatus extends IBase {
	Id :number;
TenantId :number;
StatusCode :string;
StatusName :string;
Description :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}