import { IBase } from "@/shared/IBase";
import { ISupplierInvoiceLine } from '../supplierInvoiceLine/supplierInvoiceLine';

export interface ISupplierInvoice extends IBase {
	Id :number;
SupplierInvoiceId :string;
TenantId :number;
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
