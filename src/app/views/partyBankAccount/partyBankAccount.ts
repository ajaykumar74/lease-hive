import { IBase } from "@/shared/IBase";

export interface IPartyBankAccount extends IBase {
	Id :number;
TenantId :number;
PartyId :number;
BankName :string;
BranchName :string;
AccountHolderName :string;
AccountNumber :string;
AccountNumberMasked :string;
AccountNumberEncrypted :string;
AccountType :string;
IFSCCode :string;
SWIFTCode :string;
CurrencyCode :string;
IsDefaultForPayments : boolean;
IsDefaultForRefunds : boolean;
VerificationStatus :string;
VerifiedAt :Date;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}