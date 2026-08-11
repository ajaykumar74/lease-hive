import { IBase } from "@/shared/IBase";

export interface IProspect extends IBase {
	Id :number;
Name :string;
DomainNames :string;
Potentials :number;
Mobile :string;
BrandPartnerId :number;
City :string;
Description :string;
EmailIds : string;
}