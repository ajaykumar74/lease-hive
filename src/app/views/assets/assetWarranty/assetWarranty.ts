import { IBase } from "@/shared/IBase";

export interface IAssetWarranty extends IBase {
	Id :number;
AssetWarrantyId :string;
TenantId :number;
AssetId :number;
WarrantyProviderPartyId :number;
WarrantyTypeId :number;
WarrantyNo :string;
StartDate :Date;
EndDate :Date;
CoverageSummary :string;
DocumentId :number;
WarrantyStatusId :number;

}