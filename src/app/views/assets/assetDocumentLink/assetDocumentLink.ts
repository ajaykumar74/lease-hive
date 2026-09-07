import { IBase } from "@/shared/IBase";

export interface IAssetDocumentLink extends IBase {
	Id :number;
AssetDocumentLinkId :string;
TenantId :number;
AssetId :number;
DocumentId :number;
DocumentPurposeId :number;
IsPrimary : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
IsVerified : boolean;
VerifiedBy :number;

}