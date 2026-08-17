import { IBase } from "@/shared/IBase";

export interface ICreditDocumentChecklist extends IBase {
	Id :number;
CreditDocumentChecklistId :string;
TenantId :number;
CreditApplicationId :number;
DocumentType :string;
IsRequired : boolean;
DocumentId :number;
ChecklistStatus :string;
VerifiedBy :number;
VerifiedOn :Date;

}