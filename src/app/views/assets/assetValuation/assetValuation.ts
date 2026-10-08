import { IBase } from "@/shared/IBase";

export interface IAssetValuation extends IBase {
	Id :number;
AssetValuationId :string;
TenantId :number;
AssetId :number;
ValuationTypeId :number;
ValuationDate :Date;
CurrencyCode :string;
ValuationAmount :number;
ValuerPartyId :number;
MethodCode :string;
ReferenceDocumentId :number;
ValidTo :Date;
Remarks :string;
AssetDisplayName?: string;
ValuationTypeDisplayName?: string;
ValuerPartyDisplayName?: string;
ReferenceDocumentDisplayName?: string;

}
