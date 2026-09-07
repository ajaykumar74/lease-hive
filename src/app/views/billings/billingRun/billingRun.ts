import { IBase } from "@/shared/IBase";
import { IBillingRunItem } from '../billingRunItem/billingRunItem';

export interface IBillingRun extends IBase {
	Id :number;
TenantId :number;
BillingRunNo :string;
BillingOrganisationId :number;
BillingDate :Date;
PeriodFrom :Date;
PeriodTo :Date;
BillingRunStatusId :number;
RunType :string;
CandidateCount :number;
InvoiceCount :number;
TotalAmount :number;
CurrencyCode :string;
ApprovedByUserId :number;
ApprovedAtUtc :Date;
RecordStatus :string;
BillingRunItems: IBillingRunItem[];

}
