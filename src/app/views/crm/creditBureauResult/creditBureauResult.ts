import { IBase } from "@/shared/IBase";

export interface ICreditBureauResult extends IBase {
	Id :number;
CreditBureauResultId :string;
TenantId :number;
CreditApplicationId :number;
PartyId :number;
ProviderCode :string;
RequestReference :string;
RequestedOn :Date;
ReceivedOn :Date;
Score :number;
RiskBand :number;
AdverseFlag : boolean;
RawDocumentId :string;
ResultStatusCode :string;

}