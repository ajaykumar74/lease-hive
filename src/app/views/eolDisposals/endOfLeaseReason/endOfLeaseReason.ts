import { IBase } from "@/shared/IBase";

export interface IEndOfLeaseReason extends IBase {
	Id :number;
TenantId :number;
ReasonCode :string;
ReasonName :string;
Description :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}