import { IBase } from "@/shared/IBase";

export interface IServiceAgreementCoverage extends IBase {
	Id :number;
TenantId :number;
ServiceAgreementId :number;
AssetCategoryId :number;
AssetTypeId :number;
AssetId :number;
MaintenanceTypeId :number;
CoverageCode :string;
DeductibleAmount :number;
CurrencyCode :string;
RecordStatus :string;

}