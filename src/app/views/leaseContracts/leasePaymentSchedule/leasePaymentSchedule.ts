import { IBase } from "@/shared/IBase";

export interface ILeasePaymentSchedule extends IBase {
	Id :number;
LeasePaymentScheduleId :string;
TenantId :number;
LeaseContractId :number;
ScheduleVersionNo :number;
ScheduleStatusCode :string;
CalculationMethodCode :string;
StartDate :Date;
EndDate :Date;
NumberOfPayments :number;
CurrencyCode :string;
TotalRentalAmount :number;
TotalTaxAmount :number;
GeneratedOn :Date;
GeneratedBy :number;

}