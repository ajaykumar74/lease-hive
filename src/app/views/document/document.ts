import { IBase } from "@/shared/IBase";


export interface IDocument extends IBase {
	Id: number;
	DisplayName: string;
	FileName: string;
	FileType: string;
	Size: number;
	DocumentType: string;
	RecordById: number;
	RecordByType: string;
	Version: string;
	Description: string;
	UploadedFiles?: string;
	IssuedOnDate?: string;
	ValidTillDate?: string;
	IssuedBy: string;
	DocumentNumber: string;
	Status: string;
	FilePath?: string;
}