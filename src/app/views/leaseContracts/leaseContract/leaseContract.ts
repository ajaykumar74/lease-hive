import { IBase } from "@/shared/IBase";

export interface ILeaseContract extends IBase {
	Id :number;
LeaseContractId :string;
TenantId :number;
ContractNo :string;
VersionNo :number;
LessorOrganisationId :number;
ServicingOrganisationUnitId :number;
CustomerPartyId :number;
LeaseContractStatusId :number;
SourceReferenceType :string;
SourceReferenceId :number;
QuoteId :number;
CreditApprovalReferenceId :number;
ContractDate :Date;
CommencementDate :Date;
MaturityDate :Date;
CurrencyCode :string;
ContractTitle :string;
ExternalReference :string;
RecordStatus :string;

}