import { IBase } from "@/shared/IBase";

export interface IAssetOwnershipHistory extends IBase {
	Id :number;
AssetOwnershipHistoryId :string;
TenantId :number;
AssetId :number;
OrganisationId :number;
AssetDisplayName?: string;
OrganisationDisplayName?: string;
OwnershipType :string;
AcquisitionReference :string;
Remarks :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}
