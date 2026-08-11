import { IBase } from "@/shared/IBase";

export interface INotification extends IBase {
    Id: number;

    Name: string;
    To: string;
    CC?: string;
    Subject: string;
    Content: string;
    Type: string;

    SubmittedAt?: Date;

    Status?: string;
    Description?: string;
    Attachments?: string;
    RecordByType?: string;

    RecordById: number;
    EmailBody?: string;
    CustomerId: number;
    MessageId?: string;
}
