import { IBase } from "@/shared/IBase";

export interface IReceivable extends IBase {
	Id :number;
TenantId :number;
BillingOrganisationId :number;
CustomerPartyId :number;
SourceDocumentType :string;
SourceDocumentId :number;
LeaseContractId :number;
DocumentNo :string;
DocumentDate :Date;
DueDate :Date;
CurrencyCode :string;
OriginalAmount :number;
AllocatedAmount :number;
CreditAppliedAmount :number;
WriteOffAmount :number;
OutstandingAmount :number;
ReceivableStatus :string;
DisputeHoldFlag : boolean;
RecordStatus :string;

}