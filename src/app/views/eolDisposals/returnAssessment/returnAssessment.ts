import { IBase } from "@/shared/IBase";

export interface IReturnAssessment extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
AssetReturnId :number;
AssessmentNo :string;
AssessedAt :Date;
AssessedByUserId :number;
ContractAllowanceValue :number;
ActualUsageValue :number;
ExcessUsageValue :number;
ReturnInspectionId :number;
AssessmentStatusCode :string;
RecordStatus :string;

}