import { IBase } from "@/shared/IBase";

export interface IAsset extends IBase {
	Id :number;
AssetId :string;
TenantId :number;
AssetNo :string;
AssetCategoryId :number;
AssetTypeId :number;
AssetMakeId :number;
AssetModelId :number;
OwningOrganisationId :number;
ResponsibleOrganisationUnitId :number;
CurrentLocationId :number;
CurrentPartyId :number;
CurrentPartyLocationId :number;
PrimarySerialNo :string;
AcquisitionDate :Date;
InServiceDate :Date;
AcquisitionCurrencyCode :string;
AssetStatusId :number;
ConditionGradeCode :string;
AcquisitionCost :number;
ResidualValueAmount :number;
IsLeaseable : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}