import { IBase } from "@/shared/IBase";

export interface ILeaseRequirement extends IBase {
	Id :number;
LeaseRequirementId :string;
TenantId :number;
OpportunityId :number;
OpportunityName :string;
PartyId :number;
PartyName :string;
PartyLocationId :number;
PartyLocationName :string;
RequirementDate :Date;
PreferredStartDate :Date;
RequestedTermMonths :number;
CurrencyCode :string;
RequirementStatusCode :string;
CustomerReference :string;
Remarks :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
