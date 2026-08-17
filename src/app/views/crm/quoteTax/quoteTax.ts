import { IBase } from "@/shared/IBase";

export interface IQuoteTax extends IBase {
	Id :number;
QuoteTaxId :string;
TenantId :number;
QuoteId :number;
QuoteAssetId :number;
QuoteChargeId :number;
TaxType :string;
TaxRate :number;
TaxableAmount :number;
TaxAmount :number;
JurisdictionId : boolean;
TaxRegistrationSnapshot :string;

}