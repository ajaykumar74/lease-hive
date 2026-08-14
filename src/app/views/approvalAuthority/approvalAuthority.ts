import { IBase } from "@/shared/IBase";

export interface IApprovalAuthority extends IBase {
	Id :number;
ProcessCode :number;
ApprovalLevel :number;
AuthorityType :string;
RoleId :number;
ApplicationUserId :number;
OrganisationUnitId :number;
MinimumAmount :number;
MaximumAmount :number;
RequiredApproverCount :number;
CanDelegate : boolean;
TenantId :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}