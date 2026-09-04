import { IBase } from "@/shared/IBase";

export interface IAssetSale extends IBase {
	Id :number;
TenantId :number;
SaleNo :string;
DisposalCaseId :number;
AssetId :number;
BuyerPartyId :number;
DisposalAwardId :number;
SaleDate :Date;
SaleAmount :number;
CurrencyCode :string;
FinanceHandoffId :number;
OwnershipTransferDate :Date;
StatusCode :string;
RecordStatus :string;

}