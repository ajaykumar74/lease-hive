import { IBase } from "@/shared/IBase";

export interface IDocumentLegalHold extends IBase {
	Id :number;
DocumentLegalHoldId :string;
TenantId :number;
DocumentId :number;
HoldReference :string;
Reason :string;
AppliedAtUtc :Date;
AppliedByUserId :number;
ReleasedAtUtc :Date;
ReleasedByUserId :number;
ReleaseReason :string;

}