import { IBase } from "@/shared/IBase";

export interface ISettlementChargeType extends IBase {
	Id :number;
TenantId :number;
ChargeTypeCode :string;
ChargeTypeName :string;
DirectionCode :string;
TaxableFlag : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}