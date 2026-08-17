import { IBase } from "@/shared/IBase";

export interface IQuoteCharge extends IBase {
	Id :number;
QuoteChargeId :string;
TenantId :number;
QuoteId :number;
QuoteAssetId :number;
ChargeType :string;
ChargeDescription :string;
CalculationTypeCode :string;
RateOrAmount :number;
ChargeAmount :number;
IsRecurring : boolean;
TaxCode :string;

}