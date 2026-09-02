import { IBase } from "@/shared/IBase";

export interface ILeaseAssetAllocationEvent extends IBase {
	Id :number;
LeaseAssetAllocationEventId :string;
TenantId :number;
LeaseContractAssetId :number;
EventCode :string;
EventDateTime :Date;
FromAssetId :number;
ToAssetId :number;
ReasonCode :string;
Comments :string;
PerformedBy :number;

}