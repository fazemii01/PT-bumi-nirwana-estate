interface ICatalogStaticData {
	id: string;
	contractType: string;
	propertyType: string;
	// realEstateType: string;
	
	
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
export interface IBuildingProperty {
  id: string;
  name: string;
  description: string;
  images: IImage[];
//   land_size: string;
  total_units: number;
  building_size	: string;
  price_unit: string;
  price: number;
  status: string;
  specifications: { [key: string]: null | string | number };
}

export interface IFloorPlan {
	id: string;
	name: string;
	file_url: string;
	sort_order: number;
}

export interface ICatalogListItemProps {
  id_item: string;
  building_description?: string;
  building_images?: IImage[];
  name?: string;
  price: string;
  address: string;
}

export interface ICatalogData extends ICatalogStaticData {
	visibility: boolean;
	table: ICatalogTable;
	description: ITransVersion;
	realEstateType: string;
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
	street: string;
	province: string;
	village: string;
	postal_code: string;
	city: string;
	site_plans: IFloorPlan[];
	full_name: string;
	phone_number: string;
	email: string;
	price: string;	
	building_property: IBuildingProperty[];
	// item_list: ICatalogListItemProps[];
}

export interface ITransVersion {
	[key: string]: null | string;
}

export interface ICatalogTable {
	[key: string]: null | string | number;
}
