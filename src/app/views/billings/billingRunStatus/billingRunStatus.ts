import { IBase } from "@/shared/IBase";

export interface IBillingRunStatus extends IBase {
	Id :number;
TenantId :number;
StatusCode :string;
StatusName :string;
IsFinal : boolean;
RecordStatus :string;

}