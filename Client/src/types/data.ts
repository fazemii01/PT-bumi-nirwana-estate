interface ICatalogStaticData {
	id: string;
	contractType: string;
	propertyType: string;
	realEstateType: string;
	city: string;
	price: string;
}

export interface IDataBaseResponse extends ICatalogStaticData {
	[key: string]: null | string | number;
}

export interface IImage {
	id: string;
	image_url: string;
	caption: string;
	sort_order: number;
}

export interface IFloorPlan {
	id: string;
	name: string;
	file_url: string;
	sort_order: number;
}

export interface ICatalogData extends ICatalogStaticData {
	visibility: boolean;
	table: ICatalogTable;
	description: ITransVersion;
	location: ITransVersion;
	address: ITransVersion;
	station: ITransVersion;
	images: IImage[];
	floor_plans: IFloorPlan[];
	luas : string;
}

export interface ITransVersion {
	[key: string]: null | string;
}

export interface ICatalogTable {
	[key: string]: null | string | number;
}
