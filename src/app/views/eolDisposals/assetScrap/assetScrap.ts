import { IBase } from "@/shared/IBase";

export interface IAssetScrap extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AssetId :number;
RecyclerPartyId :number;
ScrapDate :Date;
ScrapValueAmount :number;
CurrencyCode :string;
CertificateReference :string;
StatusCode :string;
Remarks :string;
RecordStatus :string;

}