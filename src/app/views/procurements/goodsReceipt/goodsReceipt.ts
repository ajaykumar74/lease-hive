import { IBase } from "@/shared/IBase";
import { IGoodsReceiptLine } from '../goodsReceiptLine/goodsReceiptLine';

export interface IGoodsReceipt extends IBase {
	Id :number;
GoodsReceiptId :string;
TenantId :number;
GRNNo :string;
PurchaseOrderId :number;
SupplierPartyId :number;
SupplierDeliveryId? :number | null;
ReceivingOrganisationUnitId :number;
ReceiptLocationId :number;
GoodsReceiptStatusId :number;
ReceiptDateTime :Date;
SupplierDeliveryNoteNo :string;
ReceivedByUserId :number;
Remarks :string;
RecordStatus :string;
LineItems?: IGoodsReceiptLine[];

}
