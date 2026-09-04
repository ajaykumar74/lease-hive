import { IBase } from "@/shared/IBase";

export interface IReturnAssessmentDamage extends IBase {
	Id :number;
TenantId :number;
ReturnAssessmentId :number;
LineNo :number;
InspectionItemReferenceId :number;
DamageCode :string;
DamageDescription :string;
ChargeableFlag : boolean;
EstimatedRepairAmount :number;
ApprovedChargeAmount :number;
CurrencyCode :string;
WaiverReason :string;
RecordStatus :string;

}