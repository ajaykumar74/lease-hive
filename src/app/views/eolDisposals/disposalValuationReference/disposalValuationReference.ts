import { IBase } from "@/shared/IBase";

export interface IDisposalValuationReference extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AssetValuationId :number;
ReferenceDate :Date;
MarketValueAmount :number;
ReserveAmount :number;
TargetAmount :number;
CurrencyCode :string;
Remarks :string;
RecordStatus :string;

}