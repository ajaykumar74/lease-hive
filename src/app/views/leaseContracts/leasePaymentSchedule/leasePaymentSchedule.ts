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

export interface IGenerateLeasePaymentScheduleRequest {
 TotalAmount: number;
 TaxRate: number;
 Months: number;
 PaymentTiming: 'ADVANCE' | 'ARREAR';
 Roi: number;
 MonthlyDueDay: number;
 RowVersionStr: string;
}
