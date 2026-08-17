import { IBase } from "@/shared/IBase";

export interface ICreditApplication extends IBase {
	Id :number;
CreditApplicationId :string;
TenantId :number;
OpportunityId :number;
PartyId :number;
OriginatingOrganisationId :number;
CreditApplicationStatusId :number;
ApplicationDate :Date;
RequestedLimitAmount :number;
CurrencyCode :string;
RequestedTermMonths :number;
RiskSegmentCode :string;
AssignedAnalystUserId :number;
SubmittedOn :Date;
DecisionOn :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}