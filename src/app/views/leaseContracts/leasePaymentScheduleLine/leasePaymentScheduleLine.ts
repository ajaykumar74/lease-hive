import { IBase } from "@/shared/IBase";

export interface ILeasePaymentScheduleLine extends IBase {
	Id :number;
LeasePaymentScheduleLineId :string;
TenantId :number;
LeasePaymentScheduleId :number;
InstallmentNo :number;
DueDate :Date;
OpeningPrincipal :number;
PrincipalAmount :number;
FinanceAmount :number;
RentalAmount :number;
TaxAmount :number;
ChargeAmount :number;
TotalDueAmount :number;
ClosingPrincipal :number;
BillingStatusCode :string;

}