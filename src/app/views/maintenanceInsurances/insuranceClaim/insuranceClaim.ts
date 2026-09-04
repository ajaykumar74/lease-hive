import { IBase } from "@/shared/IBase";

export interface IInsuranceClaim extends IBase {
	Id :number;
TenantId :number;
ClaimNo :string;
InsuranceIncidentId :number;
InsurancePolicyId :number;
InsurancePolicyAssetId :number;
InsurerClaimReference :string;
InsuranceClaimStatusId :number;
ClaimLodgedDate :Date;
ClaimedAmount :number;
ApprovedAmount :number;
DeductibleAmount :number;
CurrencyCode :string;
AssignedToUserId :number;
RejectionReason :string;
ClosedDate :Date;
RecordStatus :string;

}