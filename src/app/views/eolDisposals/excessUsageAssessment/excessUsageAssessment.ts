import { IBase } from "@/shared/IBase";

export interface IExcessUsageAssessment extends IBase {
	Id :number;
TenantId :number;
ReturnAssessmentId :number;
MeasureDefinitionId :number;
BaselineValue :number;
FinalValue :number;
AllowedUsageValue :number;
ActualUsageValue :number;
ExcessUsageValue :number;
RatePerUnit :number;
CalculatedAmount :number;
CurrencyCode :string;
RecordStatus :string;

}