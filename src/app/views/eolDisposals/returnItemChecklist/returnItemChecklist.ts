import { IBase } from "@/shared/IBase";

export interface IReturnItemChecklist extends IBase {
	Id :number;
TenantId :number;
AssetReturnId :number;
LineNo :number;
ItemCode :string;
ItemDescription :string;
ExpectedQuantity :number;
ReturnedQuantity :number;
ConditionCode :string;
ChargeableFlag : boolean;
RecordStatus :string;

}