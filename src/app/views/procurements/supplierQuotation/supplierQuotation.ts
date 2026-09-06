import { IBase } from "@/shared/IBase";

export interface ISupplierQuotation extends IBase {
	Id :number;
SupplierQuotationId :string;
TenantId :number;
RFQId :number;
SupplierPartyId :number;
SupplierQuoteNo :string;
VersionNo :number;
QuoteDate :Date;
ValidUntil :Date;
CurrencyCode :string;
Subtotal :number;
TaxAmount :number;
TotalAmount :number;
PaymentTermCode :string;
DeliveryDays :number;
QuotationStatusCode :string;
RecordStatus :string;

}