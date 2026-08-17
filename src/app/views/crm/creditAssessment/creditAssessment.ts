import { IBase } from "@/shared/IBase";

export interface ICreditAssessment extends IBase {
	Id :number;
CreditAssessmentId :string;
TenantId :number;
CreditApplicationId :number;
AssessmentVersion :string;
AssessmentTypeCode :string;
AssessedByUserId :number;
AssessmentDateTime :Date;
RiskRatingCode :string;
Score :number;
ProbabilityOfDefaultPct :number;
RecommendedLimitAmount :number;
CurrencyCode :string;

}