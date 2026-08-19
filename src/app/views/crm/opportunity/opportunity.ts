import { IBase } from "@/shared/IBase";

export interface IOpportunity extends IBase {
	Id :number;
OpportunityId :string;
TenantId :number;
LeadId :number;
PartyId :number;
OriginatingOrganisationId :number;
OwnerOrganisationUnitId :number;
OwnerUserId :number;
OpportunityStageId :number;
OpportunityName :string;
EstimatedAmount :number;
CurrencyCode :string;
ProbabilityPct :number;
ExpectedCloseDate :Date;
LostReasonCode :string;
ClosedOn :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}
