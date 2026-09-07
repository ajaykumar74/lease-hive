import { IBase } from "@/shared/IBase";

export interface IAssetLifecycleEvent extends IBase {
	Id :number;
AssetLifecycleEventId :string;
TenantId :number;
AssetId :number;
EventTypeId :number;
EventDateTime :Date;
OrganisationUnitId :number;
PartyId :number;
LocationId :number;
ReferenceType :string;
ReferenceId :number;
Summary :string;

}