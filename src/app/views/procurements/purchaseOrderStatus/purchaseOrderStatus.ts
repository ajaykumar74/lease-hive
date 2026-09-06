import { IBase } from "@/shared/IBase";

export interface IPurchaseOrderStatus extends IBase {
	Id :number;
PurchaseOrderStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsEditable : boolean;
IsTerminal : boolean;
SortOrder :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}