import { IBase } from "@/shared/IBase";

export interface ICreditFinancialSnapshot extends IBase {
	Id :number;
CreditFinancialSnapshotId :string;
TenantId :number;
CreditAssessmentId :number;
FinancialPeriodEnd :number;
CurrencyId :string;
RevenueAmount :number;
EBITDAAmount :number;
NetProfitAmount :number;
NetWorthAmount :number;
TotalDebtAmount :number;
CurrentRatio :string;
DebtEquityRatio :string;
DSCR :string;
SourceDocumentId :string;

}