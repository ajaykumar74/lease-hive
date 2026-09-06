import { IBase } from "@/shared/IBase";

export interface IGoodsReceiptStatus extends IBase {
	Id :number;
GoodsReceiptStatusId :string;
TenantId :number;
StatusCode :string;
StatusName :string;
IsTerminal : boolean;
SortOrder :number;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}