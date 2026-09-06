import { IBase } from "@/shared/IBase";

export interface IInvoiceMatch extends IBase {
	Id :number;
InvoiceMatchId :string;
TenantId :number;
SupplierInvoiceId :number;
PurchaseOrderId :number;
GoodsReceiptId :number;
MatchTypeCode :string;
MatchedOn :Date;
MatchedBy :number;
QuantityVariance :number;
AmountVariance :number;
TolerancePassed : boolean;
MatchResultCode :string;

}