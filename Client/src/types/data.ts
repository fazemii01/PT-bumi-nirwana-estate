interface ICatalogStaticData {
	id: string;
	contractType: string;
	propertyType: string;
	realEstateType: string;
	city: string;
	price: string;
	street: string;
	province: string;
	village: string;
	postal_code: string;
}

export interface IDataBaseResponse extends ICatalogStaticData {
	[key: string]: null | string | number;
}

export interface IImage {
	id: string;
	image_url: string;
	caption: string | null;
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
	jenis: ITransVersion;
	detail_description: string;
	location: ITransVersion;
	address: ITransVersion;
	station: ITransVersion;
	images: IImage[];
	floor_plans: IFloorPlan[];
	luas : string;
	land_size : string;
	status: string;
	name: string;
	type: string;
}

export interface ITransVersion {
	[key: string]: null | string;
}

export interface ICatalogTable {
	[key: string]: null | string | number;
}
