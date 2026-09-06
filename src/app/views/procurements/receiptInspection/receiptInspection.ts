import { IBase } from "@/shared/IBase";

export interface IReceiptInspection extends IBase {
	Id :number;
ReceiptInspectionId :string;
TenantId :number;
GoodsReceiptLineId :number;
GoodsReceiptSerialId :number;
InspectionDateTime :Date;
InspectorUserId :number;
ResultCode :string;
ChecklistJson :string;
Remarks :string;
DocumentId :number;

}