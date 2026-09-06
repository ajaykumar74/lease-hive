import { IBase } from "@/shared/IBase";

export interface IGoodsReceipt extends IBase {
	Id :number;
GoodsReceiptId :string;
TenantId :number;
GRNNo :string;
PurchaseOrderId :number;
SupplierPartyId :number;
ReceivingOrganisationUnitId :number;
ReceiptLocationId :number;
GoodsReceiptStatusId :number;
ReceiptDateTime :Date;
SupplierDeliveryNoteNo :string;
ReceivedByUserId :number;
Remarks :string;
RecordStatus :string;

}