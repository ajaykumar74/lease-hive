import { IBase } from "@/shared/IBase";

export interface IInsuranceClaimAssessment extends IBase {
	Id :number;
TenantId :number;
InsuranceClaimId :number;
AssessmentNo :string;
AssessorPartyId :number;
AssessmentDate :Date;
EstimatedRepairAmount :number;
AssessedLossAmount :number;
RepairabilityCode :string;
SalvageValue :number;
CurrencyCode :string;
AssessmentSummary :string;
RecordStatus :string;

}