import { IBase } from "@/shared/IBase";

export interface ICustomerInvoiceTax extends IBase {
	Id :number;
TenantId :number;
CustomerInvoiceId :number;
CustomerInvoiceLineId :number;
TaxTypeId :number;
TaxJurisdictionId :number;
TaxCode :string;
TaxRate :number;
TaxableAmount :number;
TaxAmount :number;
TaxRegistrationSnapshot :string;
RecordStatus :string;

}