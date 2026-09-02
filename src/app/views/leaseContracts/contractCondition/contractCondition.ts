import { IBase } from "@/shared/IBase";

export interface IContractCondition extends IBase {
	Id :number;
ContractConditionId :string;
TenantId :number;
LeaseContractId :number;
ConditionTypeCode :string;
ConditionDescription :string;
RequiredForEventCode :string;
DueDate :Date;
MandatoryFlag : boolean;
WaiverAllowedFlag : boolean;
StatusCode :string;
SatisfiedOn :Date;
SatisfiedBy :number;

}