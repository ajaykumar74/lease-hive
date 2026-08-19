import { IBase } from "@/shared/IBase";

export interface IPurchaseRequisitionStatus extends IBase {
	Id :number;
PurchaseRequisitionStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsTerminal : boolean;
SortOrder :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}