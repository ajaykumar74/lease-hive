import { IBase } from "@/shared/IBase";

export interface IQuotePricingScenario extends IBase {
	Id :number;
QuotePricingScenarioId :string;
TenantId :number;
QuoteId :number;
ScenarioNo :number;
ScenarioName :string;
PricingModeCode :string;
PaymentTimingCode :string;
TermMonths :number;
AnnualFundingRate :number;
DownPaymentAmount :number;
BulletPaymentAmount :number;
PeriodicBaseRental :number;
PeriodicServiceAmount :number;
TotalContractValue :number;
PricingEngineVersion :string;
InputsJson :string;
ResultsJson :string;
CalculatedAt :Date;
IsSelected : boolean;
RecordStatus :string;

}