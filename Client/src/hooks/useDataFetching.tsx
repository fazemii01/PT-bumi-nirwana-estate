import { useEffect, useState } from 'react';
import { BACKEND_LOCALHOST } from '@utils/const';
import type { Property } from '../types/property-entity';
import type { ICatalogData, ITransVersion, IFloorPlan } from '../types/data';
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
    const building_images =
      property.building_property?.map((b) => b.images).flat() || [];
    const firstUnit = property.building_property?.[0];

    const building_asset = property.building_property?.[0] || {};
    const building_assets = property.building_property || [];
    const unitSpecifications = firstUnit && typeof firstUnit.specifications === 'string'
      ? JSON.parse(firstUnit.specifications)
      : firstUnit?.specifications || {};
      
    const detailUnit = property.building_property?.[0];
    const detailSpecifications = detailUnit && typeof detailUnit.specifications === 'string'
      ? JSON.parse(detailUnit.specifications)
      : firstUnit?.specifications || {};

    // console.log('Parsed Specifications for ' + property.name + ':', unitSpecifications);
    // dongeo

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
        bedrooms: unitSpecifications.bedrooms || 0,
        bathrooms: unitSpecifications.bathrooms || 0,
      },
      description: { en: property.description || '', id: property.description || '' },
      jenis: { en: property.jenis || '', id: property.jenis || '' },
      luas: property.luas,
      type: property.type,

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
      full_name: property.agent?.[0]?.full_name || '',
      images: property.images || [],
      floor_plans: property.floor_plans || [],
      site_plans: property.site_plans || [],
      land_size: building_asset?.land_size || '',

      building_property: property.building_property?.map(bp => ({
        id: bp.id,
        name: bp.name,
        description: bp.description,
        images: bp.images || [],
        total_units: bp.total_units,
        building_size: bp.building_size,
        price_unit: bp.price_unit || '',
        price: bp.price_start_from || 0,
        status: bp.status,
        land_size: bp.land_size,
        specifications: {
          bedrooms: detailSpecifications.bedrooms || 0,
          bathrooms: detailSpecifications.bathrooms || 0,
          offices: detailSpecifications.offices || 0,
          totalArea: detailSpecifications.totalArea || 0,
        },
        floor_plans: bp.floor_plans || [],
      })) || [],

      agent: Array.isArray(property.agent)
        ? property.agent
        : property.agent
          ? [property.agent]
          : [],

      developer: Array.isArray(property.developer)
        ? property.developer
        : property.developer
          ? [property.developer]
          : [],
      // building_property: Array.isArray(property.building_property)
      //   ? property.building_property
      //   : property.building_property
      //     ? [property.building_property]
      //     : [],
        
      // item_list: property.building_property?.map(bl => ({
      //   id_item: bl.id,
      //   name: bl.name,
      //   price: bl.price?.toString() || '0',
      //   visibility: bl.status === 'AVAILABLE',
      //   address: bl.address || '',
      //   building_description: bl.description || '',
      //   building_images: bl.images || [],
      // })) || [],
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
        // console.log('Raw API response:', properties);
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