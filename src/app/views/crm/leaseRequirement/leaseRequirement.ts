import { IBase } from "@/shared/IBase";

export interface ILeaseRequirement extends IBase {
	Id :number;
LeaseRequirementId :number;
TenantId :number;
OpportunityId :number;
PartyId :number;
PartyLocationId :number;
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