import { IBase } from "@/shared/IBase";

export interface IPicklistItem extends IBase {
	Id :number;
Category :string;
ItemName :string;
Description :string;
IsSystem : boolean;
PartnerId :number;

}