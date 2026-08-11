import { PageEvent } from "./IBase";
import { IPermission } from "./IPermission";

export interface ICacheData {
	Data: any;  
	permission: IPermission;
	TotalRecords: number;
	SearchParams: any;
	CurrentPage: number;
	SortBy: string;
	IsDescending: boolean;
	IsLoaded: boolean;
	objSearch: any;
	stateData: any;
	pgEvent: PageEvent ;
}