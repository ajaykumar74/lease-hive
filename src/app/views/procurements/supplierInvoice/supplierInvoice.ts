import { IBase } from "@/shared/IBase";
import { ISupplierInvoiceLine } from '../supplierInvoiceLine/supplierInvoiceLine';

export interface ISupplierInvoice extends IBase {
	Id :number;
SupplierInvoiceId :string;
TenantId :number;
PurchaseOrderId :number | null;
SupplierPartyId :number;
BuyingOrganisationId :number;
SupplierInvoiceNo :string;
InvoiceDate :Date;
CurrencyCode :string;
Subtotal :number;
TaxAmount :number;
TotalAmount :number;
MatchStatusCode :string;
InvoiceDocumentId :number;
APReferenceId :number;
CapturedOn :Date;
CapturedBy :number;
RecordStatus :string;
LineItems: ISupplierInvoiceLine[];

}

export interface ISupplierInvoicePurchaseOrderContext {
    PurchaseOrderId: number;
    SupplierPartyId: number;
    BuyingOrganisationId: number;
    CurrencyCode: string;
    LineItems: ISupplierInvoiceEligibleLine[];
}

export interface ISupplierInvoiceEligibleLine {
    PurchaseOrderLineId: number;
    GoodsReceiptLineId: number;
    GRNNo: string;
    Description: string;
    AcceptedQuantity: number;
    EligibleQuantity: number;
    UOMId: number;
    UnitPrice: number;
    DefaultTaxAmount: number;
}
