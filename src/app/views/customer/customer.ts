import { IBase } from "@/shared/IBase";

export interface ICustomer extends IBase {
	Id: number;
	CustomerCode: string;
	FirstName: string;
	MiddleName: string;
	LastName: string;
	DateOfBirth: Date;
	Gender: string;
	MaritalStatus: string;
	FatherOrSpouseName: string;
	MobileNumber: string;
	AlternateMobile: string;
	Email: string;
	PAN: string;
	AadhaarNumber: string;
	DrivingLicenseNumber: string;
	DrivingLicenseExpiry: Date;
	Status: string;
	CompanyName: string;
	ShortName: string;
	CIN: string;
	BusinessPAN: string;
	AuthorizedSignatoryName: string;
	AuthorizedSignatoryPAN: string;
	AuthorizedSignatoryMobile: string;
	RegisteredOfficeAddress: string;
	NatureOfBusiness: string;
	YearsInBusiness: number;
	PermanentAddress: string;
	PermanentCity: string;
	PermanentState: string;
	PermanentPin: string;
	PermanentLandmark: string;
	WorkAddress: string;
	WorkCity: string;
	WorkState: string;
	WorkPin: string;
	WorkLandmark: string;
	CustomerCategory: string;
	IsDeleted: boolean;
	DeletedReason: string;
	Description: string;
	Classification: string;

}