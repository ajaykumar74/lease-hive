import { IBase } from "@/shared/IBase";

export interface IPartyDocument extends IBase {
	Id :number;
PartyDocumentId :string;
TenantId :number;
PartyId :number;
PartyIDocumentd :string;
DocumentType :string;
DocumentNumber :string;
FileDocumentId :number;
IssuedBy :string;
IssueDate :Date;
ExpiryDate :Date;
VerificationStatus :string;
VerifiedBy :string;
VerifiedById :number;
VerifiedAt :Date;
RejectionReason :string;
RecordByType :string;
RecordById :number;
RecordStatus :string;
EffectiveFrom :Date;
EffectiveTo :Date;

}
