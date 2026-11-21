import { IBase } from "@/shared/IBase";

export interface IAssetCategory extends IBase {
	Id :number;
AssetCategoryId :string;
TenantId :string;
CategoryCode :string;
CategoryName :string;
ParentCategoryId :number;
ParentCategoryDisplayName?: string;
SupportsRegistration : boolean;
SupportsMeasure : boolean;
ExtensionTypeCode :string;
/** Vehicle-only compliance policy. These remain false/empty for unrelated categories. */
RequiresDriverKyc?: boolean;
RequiresIdentityProof?: boolean;
RequiresDrivingLicence?: boolean;
RequiresEmployerAuthorization?: boolean;
RequiredDrivingLicenceClass?: string;
EffectiveFrom :Date;
EffectiveTo :Date | null;
RecordStatus :string;

}
