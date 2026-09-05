import { IBase } from "@/shared/IBase";

export interface IPartyRole extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
RoleType :string;
RoleCode :string;
OrganisationId :number;
RoleStatus :string;
OnboardingReference :string;
ApprovedBy :string;
ApprovedById :number;
ApprovedAt :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}