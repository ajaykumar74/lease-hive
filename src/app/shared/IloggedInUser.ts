export class loggedInUser { 
	Username :string;  //username in identity 
	UserId :  string; //userid in identity 
	Role : string  ; //role in identity 
	RecordId: number;  //RecordId (PortalUserId) in identity 
	Name :string; //user in PortalUser
	Gender: string; //gender in PortalUser
	Customer : any; //details of customer under which user registered
	BrandPartner:any ; // details of BrandPartner, required for locale formats
	AccountType : string;
	Tenant  : any; //TenantId in PortalUser
	
}