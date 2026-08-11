 
export interface IPermission {
	CanCreate :boolean;
	CanUpdate? :boolean;
	CanDelete? : boolean;  
	CanViewOnly? :boolean;
	CanPrint? : boolean;
}