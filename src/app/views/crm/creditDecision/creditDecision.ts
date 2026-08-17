import { IBase } from "@/shared/IBase";

export interface ICreditDecision extends IBase {
	Id :number;
CreditDecisionId :string;
TenantId :number;
CreditApplicationId :number;
CreditAssessmentId :number;
DecisionCode :string;
DecisionDateTime :Date;
ApprovedLimitAmount :number;
CurrencyCode :string;
ApprovedTermMonths :number;
RiskRatingCode :string;
DecisionReasonCode :string;
DecisionSummary :string;
ValidUntil :Date;
ApprovalRequestId :number;
DecidedBy :number;

}