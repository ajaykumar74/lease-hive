import { IBase } from "@/shared/IBase";

export interface ILeaseContractDeposit extends IBase {
	Id :number;
LeaseContractDepositId :string;
TenantId :number;
LeaseContractId :number;
DepositTypeCode :string;
RequiredAmount :number;
CurrencyCode :string;
DueDate :Date;
RefundableFlag : boolean;
InterestBearingFlag : boolean;
FinanceReferenceId :number;
StatusCode :string;

}