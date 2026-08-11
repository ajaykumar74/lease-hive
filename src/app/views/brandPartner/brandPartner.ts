import { IBase } from "@/shared/IBase";

export interface IBrandPartner extends IBase {
	Id: number;
	Code: string;
	BusinessId: string;
	BusinessName: string;
	EmailId: string;
	Mobile: string;
	ShortName: string;
	Landline: string;
	AddressLine1: string;
	AddressLine2: string;
	City: string;
	Country: string;
	PostalCode: string;
	CustomerLimit: number;
	CurrencySymbol: string;
	TimeZone: string;
	DateFormat: string;
	TimeFormat: string;
	Description: string;
	IsDeleted: boolean;
	DeletedReason: string;
	RefreshToken: string;
	TenentId: string;

}