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
AssetAssignmentDisplayName?: string;
FromAssetUserDisplayName?: string;
ToAssetUserDisplayName?: string;
FromPartyLocationDisplayName?: string;
ToPartyLocationDisplayName?: string;
Remarks :string;

}
