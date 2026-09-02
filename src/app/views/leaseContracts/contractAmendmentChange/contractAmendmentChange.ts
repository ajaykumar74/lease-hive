import { IBase } from "@/shared/IBase";

export interface IContractAmendmentChange extends IBase {
	Id :number;
ContractAmendmentChangeId :string;
TenantId :number;
ContractAmendmentId :number;
ChangeSectionCode :string;
ReferenceType :string;
ReferenceId :number;
FieldName :string;
OldValue :string;
NewValue :string;
ChangeSummary :string;

}