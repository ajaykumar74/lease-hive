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
Lines: ISupplierQuotationDetailLine[];
Documents: ISupplierQuotationDocument[];

}

export interface ISupplierQuotationDetailLine {
SupplierQuotationLineId: number;
RFQLineId: number;
LineNo: number;
Description: string;
RequestedQuantity: number;
QuotedQuantity: number;
UnitPrice: number;
DiscountAmount: number;
TaxAmount: number;
LineTotal: number;
DeliveryDate?: Date;
}

export interface ISupplierQuotationDocument {
LinkId: number;
DocumentId: number;
Name: string;
UploadedAtUtc: Date;
SupplierName: string;
}
