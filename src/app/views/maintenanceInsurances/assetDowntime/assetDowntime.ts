import { IBase } from "@/shared/IBase";

export interface IAssetDowntime extends IBase {
	Id :number;
TenantId :number;
AssetId :number;
MaintenanceWorkOrderId :number;
InsuranceIncidentId :number;
DowntimeStartAt :Date;
DowntimeEndAt :Date;
DowntimeReasonCode :string;
CustomerImpactCode :string;
ReplacementAssetId :number;
Remarks :string;
RecordStatus :string;

}