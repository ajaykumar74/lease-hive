import { IBase } from "@/shared/IBase";

export interface IContractAssetReturnInstruction extends IBase {
	Id :number;
ContractAssetReturnInstructionId :string;
TenantId :number;
LeaseContractId :number;
LeaseContractAssetId :number;
ContractTerminationId :number;
InstructionCode :string;
RequiredByDate :Date;
ReturnLocationId :number;
StatusCode :string;
OperationsReferenceId :number;

}