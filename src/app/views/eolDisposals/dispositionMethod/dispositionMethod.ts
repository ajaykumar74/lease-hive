import { IBase } from "@/shared/IBase";

export interface IDispositionMethod extends IBase {
	Id :number;
TenantId :number;
DispositionMethodCode :string;
DispositionMethodName :string;
RequiresBuyerFlag : boolean;
RequiresApprovalFlag : boolean;
EffectiveFrom :Date;
EffectiveTo :Date;
RecordStatus :string;

}