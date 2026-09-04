import { IBase } from "@/shared/IBase";

export interface ISupplierReturn extends IBase {
	Id :number;
TenantId :number;
DisposalCaseId :number;
AssetId :number;
SupplierPartyId :number;
ReturnDate :Date;
ReturnReference :string;
CreditExpectedAmount :number;
CurrencyCode :string;
StatusCode :string;
Remarks :string;
RecordStatus :string;

}