import { IBase } from "@/shared/IBase";

export interface ISupplierQuotationLine extends IBase {
	Id :number;
SupplierQuotationLineId :string;
TenantId :number;
SupplierQuotationId :number;
RFQLineId :number;
Quantity :number;
UnitPrice :number;
DiscountAmount :number;
TaxAmount :number;
LineTotal :number;
DeliveryDate :Date;
ComplianceCode :string;
DeviationNotes :string;

}