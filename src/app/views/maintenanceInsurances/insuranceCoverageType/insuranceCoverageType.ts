import { IBase } from "@/shared/IBase";

export interface IInsuranceCoverageType extends IBase {
	Id :number;
TenantId :number;
CoverageTypeCode :string;
CoverageTypeName :string;
Description :string;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}