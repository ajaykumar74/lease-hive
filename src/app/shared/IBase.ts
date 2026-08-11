export interface IBase {
	Id: number;
	CreatedByCode?: string;
	ModifiedByCode?: string;
	RowVersionStr?: string;
	CreatedDateTime?: Date;
	ModifiedDateTime?: Date;
	CreatedById?: number;
	ModifiedById?: number;
	IsModified?: boolean;
	IsSelected?: boolean;
}

export interface PageEvent {
	first: number;
	rows: number;
	page: number;
	pageCount: number;

}