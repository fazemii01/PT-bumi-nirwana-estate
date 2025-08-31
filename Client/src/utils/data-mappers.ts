import { ICatalogData, IImage, ICatalogTable, ITransVersion } from '../types/data';

export function transformPropertyToCatalogData(property: any): ICatalogData {
  // Parse address dan specifications dari string JSON
  const parsedAddress: ITransVersion =
    typeof property.address === 'string' ? JSON.parse(property.address) : property.address;

  const parsedTable: ICatalogTable =
    typeof property.specifications === 'string'
      ? JSON.parse(property.specifications)
      : property.specifications || {};

  return {
    id: property.id,
    contractType: property.status || '',
    propertyType: property.name || '',
    realEstateType: property.jenis || '',
    city: parsedAddress?.city || '',
    price: property.price || '',
    visibility: true,
    table: parsedTable,
    description: property.description || '',
    location: property.location || {},
    address: parsedAddress,
    station: {},
    images: property.images || [],
    luas: property.luas || '',
    jenis: property.jenis_trans || {}, 
    detail_description: property.detail_description || '',
    floor_plans: property.floor_plans || [],
    status: property.current_status || 'available', 
  };
}