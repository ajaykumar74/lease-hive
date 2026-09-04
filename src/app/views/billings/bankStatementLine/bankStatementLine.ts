import { IBase } from "@/shared/IBase";

export interface IBankStatementLine extends IBase {
	Id :number;
TenantId :number;
BankStatementId :number;
TransactionDate :Date;
ValueDate :Date;
BankReference :string;
Narration :string;
DebitAmount :number;
CreditAmount :number;
MatchedPaymentReceiptId :number;
MatchStatus :string;
MatchConfidence :number;
RecordStatus :string;

}