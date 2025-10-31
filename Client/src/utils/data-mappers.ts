import { ICatalogData, IImage, ICatalogTable, ITransVersion } from '../types/data';

export function transformPropertyToCatalogData(property: any): ICatalogData {
  const parsedAddress: ITransVersion =
    typeof property.address === 'string' ? JSON.parse(property.address) : property.address;

  const parsedTable: ICatalogTable =
    typeof property.specifications === 'string'
      ? JSON.parse(property.specifications)
      : property.specifications || {};

  return {
  // id : property.building_property?.id || '',
  id: property.id,
  contractType: property.status || '',
  propertyType: property.name || '',
  realEstateType: property.jenis || '',
  city: parsedAddress?.city || '',
  price: property.price || '',
  visibility: true,

  images: property.images || [],
  luas: property.luas || '',
  land_size: property.land_size || '',

  detail_description: property.detail_description || '',
  floor_plans: property.floor_plans || [],
  site_plans: property.site_plans || [],
  status: property.current_status || 'available',
  name: property.name,
  type: property.type,
  street: parsedAddress?.street || '',
  province: parsedAddress?.province || '',
  postal_code: parsedAddress?.postal_code || '',
  village: parsedAddress?.village || '',
  full_name: property.full_name || '',
  // phone_number: property.phone_number || '',
  // email: property.email || '',
  building_property: [],
  agent: [],
  developer: [],
  address: parsedAddress || { en: '', id: '' },
  location: property.location || { en: '', id: '' },
  station: { en: '', id: '' },
  table: parsedTable || { bedrooms: 0, bathrooms: 0 },
  description: property.description || { en: '', id: '' },
  jenis : property.jenis || { en: '', id: '' },
};
}