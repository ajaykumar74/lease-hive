import { IBase } from "@/shared/IBase";

export interface IInsuranceIncident extends IBase {
	Id :number;
TenantId :number;
IncidentNo :string;
AssetId :number;
LeaseContractId :number;
IncidentTypeCode :string;
IncidentAt :Date;
LocationId :number;
CustomerPartyId :number;
AssetUserId :number;
ReportedAt :Date;
ReportedByUserId :number;
IncidentDescription :string;
PoliceReferenceNo :string;
AssetDrivableFlag : boolean;
StatusCode :string;
RecordStatus :string;

}