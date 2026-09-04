import { IBase } from "@/shared/IBase";

export interface ICustomerDeposit extends IBase {
	Id :number;
TenantId :number;
LeaseContractId :number;
LeaseContractDepositId :number;
CustomerPartyId :number;
BillingOrganisationId :number;
DepositTypeCode :string;
CurrencyCode :string;
RequiredAmount :number;
ReceivedAmount :number;
UtilizedAmount :number;
RefundedAmount :number;
ForfeitedAmount :number;
AvailableBalance :number;
DepositStatus :string;
RecordStatus :string;

}