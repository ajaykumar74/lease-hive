import { IBase } from "@/shared/IBase";

export interface IQuotePricingSchedule extends IBase {
	Id :number;
QuotePricingScheduleId :string;
TenantId :number;
QuotePricingScenarioId :number;
QuoteAssetId :number;
PeriodNo :number;
PaymentDueDate :Date;
OpeningBalance :number;
FinanceCharge :number;
PrincipalRecovery :number;
BaseRentalAmount :number;
ServiceAmount :number;
BulletAmount :number;
ClosingBalance :number;
RecordStatus :string;

}