import { IBase } from "@/shared/IBase";

export interface ILead extends IBase {
	Id :number;
LeadId :string;
TenantId :number;
OriginatingOrganisationId :number;
OwnerOrganisationUnitId :number;
OwnerUserId :number;
LeadSourceId :number;
LeadStatusId :number;
ProspectName :string;
ContactName :string;
Email :string;
Phone :string;
CountryCode :string;
InterestedAssetCategoryId :number;
EstimatedValue :number;
CurrencyCode :string;
ExpectedCloseDate :Date;
QualifiedPartyId :number;
QualifiedOn :Date;
DisqualificationReason :string;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;
Description :string;

}