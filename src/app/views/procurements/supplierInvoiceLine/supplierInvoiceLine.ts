import { IBase } from "@/shared/IBase";

export interface ISupplierInvoiceLine extends IBase {
	Id :number;
SupplierInvoiceLineId :string;
TenantId :number;
SupplierInvoiceId :number;
LineNo :number;
PurchaseOrderLineId :number;
GoodsReceiptLineId :number;
Description :string;
InvoicedQuantity :number;
UOMId :number;
UnitPrice :number;
TaxAmount :number;
LineTotal :number;

}