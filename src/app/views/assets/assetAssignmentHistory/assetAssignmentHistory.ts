import { IBase } from "@/shared/IBase";

export interface IAssetAssignmentHistory extends IBase {
	Id :number;
AssetAssignmentHistoryId :string;
TenantId :number;
AssetAssignmentId :number;
EventTypeId :string;
EventDateTime :Date;
FromAssetUserId :number;
ToAssetUserId :number;
FromPartyLocationId :number;
ToPartyLocationId :number;
Remarks :string;

}