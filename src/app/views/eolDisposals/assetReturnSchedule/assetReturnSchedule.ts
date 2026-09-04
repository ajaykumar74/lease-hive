import { IBase } from "@/shared/IBase";

export interface IAssetReturnSchedule extends IBase {
	Id :number;
TenantId :number;
EndOfLeaseCaseId :number;
AssetId :number;
ScheduledReturnAt :Date;
ReturnLocationId :number;
ResponsibleOrganisationUnitId :number;
StatusCode :string;
CustomerContactPartyId :number;
Remarks :string;
RecordStatus :string;

}