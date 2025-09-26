import { useEffect, useState } from 'react';
import { BACKEND_LOCALHOST } from '@utils/const';
import type { Property } from '../types/property-entity';
import type { ICatalogData, ITransVersion } from '../types/data';
import { add } from 'cheerio/lib/api/traversing';


function formatPropertiesForCatalog(properties: Property[]): ICatalogData[] {
  if (!properties) return [];
  
  return properties.map((property) => {
    const address = typeof property.address === 'string'
      ? JSON.parse(property.address)
      : property.address || {};
    const specifications = property.specifications || {};

    const location: ITransVersion = {
      lat: property.location?.coordinates?.[1]?.toString() || null,
      lng: property.location?.coordinates?.[0]?.toString() || null,
    };

    return {
      id: property.id,
      name: property.name,
      price: property.price?.toString() || '0',
      visibility: property.status === 'AVAILABLE',
      address: {
        en: address.street || '',
        id: address.street || '',
      },
      location,
      table: {
        bedrooms: specifications.kamar || 0,
        bathrooms: specifications.kamar_mandi || 0,
      },
      description: { en: property.description || '', id: property.description || '' },
      jenis: { en: property.jenis || '', id: property.jenis || '' },
      luas: property.luas,
      type: property.type,
      land_size: property.land_size,
      detail_description: property.detail_description,
      status: property.status,
      contractType: specifications.contractType || '',
      propertyType: specifications.propertyType || '',
      realEstateType: specifications.realEstateType || '',
      city: address.city || '',
      street: address.street || '',
      province: address.province || '',
      postal_code: address.postal_code || '',
      village: address.village || '',
      station: {},
      images: property.images || [],
      floor_plans: property.floor_plans || [],
    };
  });
}


const usePropertiesFetching = () => {
  const [data, setData] = useState<ICatalogData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BACKEND_LOCALHOST}/properties`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((properties: Property[]) => {
        const formattedData = formatPropertiesForCatalog(properties);
        setData(formattedData);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching properties:', error);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { data, loading };
};

export default usePropertiesFetching;