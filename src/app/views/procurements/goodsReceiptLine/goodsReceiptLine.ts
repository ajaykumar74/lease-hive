import { IBase } from "@/shared/IBase";

export interface IGoodsReceiptLine extends IBase {
	Id :number;
GoodsReceiptLineId :string;
TenantId :number;
GoodsReceiptId :number;
PurchaseOrderLineId :number;
LineNo :number;
ReceivedQuantity :number;
AcceptedQuantity :number;
RejectedQuantity :number;
UOMId :number;
InspectionRequired : boolean;
InspectionStatusCode :string;
RejectionReason :string;

}