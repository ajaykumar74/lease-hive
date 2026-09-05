import { IBase } from "@/shared/IBase";

export interface IPartyCreditProfile extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
CreditPolicyCode :string;
RiskGrade :string;
ExternalCreditScore :number;
ApprovedExposureLimit :number;
CurrencyCode :string;
CurrentExposure :number;
AvailableExposure :number;
PaymentTermsDays :number;
SecurityDepositPercentage :number;
ReviewFrequencyMonths :number;
NextReviewDate :Date;
CreditHoldFlag : boolean;
CreditHoldReason :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}