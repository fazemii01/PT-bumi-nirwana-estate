import { useEffect, useMemo, useState } from 'react';

import { BACKEND_LOCALHOST } from '@utils/const';

import type { ICatalogData, ITransVersion, ICatalogTable } from '../types/data';
import type { Property } from '../types/property-entity';
import type { IBuildingProperty } from '../types/building-property-entity';
const useDataFetching = () => {
  const initialData: ICatalogData = {
    city: '',
    contractType: '',
    id: '',
    price: '',
    propertyType: '',
    realEstateType: '',
    station: {},
    visibility: false,
    description: {},
    status: '',
    detail_description: '',
    address: {},
    location: {},
    table: {},
    images: [],
    floor_plans: [],
    luas: '',
    jenis: {},
    land_size: '',
    name: '',
    type: '',
  };

  const [data, setData] = useState<ICatalogData[]>([initialData]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const controller = new AbortController();

  //   fetch(`${BACKEND_LOCALHOST}/properties`, {
  //     signal: controller.signal,
  //   })
  //     .then((response) => response.json())
  //     .then((data: Property[]) => memoizedSortData(data))
  //     .catch((error) => console.error('Error fetching data:', error));

  //   return () => controller.abort();
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchOptions = {
      signal,
      cache: 'no-store' as RequestCache
    };

    const fetchParentProperties = fetch(`${BACKEND_LOCALHOST}/properties`, fetchOptions).then((res) => res.json());
    const fetchIndividualUnits = fetch(`${BACKEND_LOCALHOST}/building-property`, fetchOptions).then((res) => res.json());



    Promise.all([
      fetchParentProperties as Promise<Property[]>,
      fetchIndividualUnits as Promise<IBuildingProperty[]>
    ])
      .then(([parentProperties, individualUnits]) => {


        const parentPropertiesMap = new Map(parentProperties.map((p: Property) => [p.id, p]));

        const finalCombinedData = individualUnits.map((unit: IBuildingProperty) => {
          const parentData = parentPropertiesMap.get(unit.property.id);

          return {
            ...parentData,
            ...unit,
            id: unit.id,
            images: [
              ...(parentData?.images || []), 
              ...(unit.images || []),       
            ],
          };
        });


        memoizedSortData(finalCombinedData as any[]);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Error fetching data:', error);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line
  }, []);

  const sortData = (data: Property[]) => {
    const result = data.map((property: Property) => {
      const address = typeof property.address === 'string'
        ? JSON.parse(property.address)
        : property.address || {};
      const specifications = typeof property.specifications === 'string' ? JSON.parse(property.specifications) : property.specifications || {};

      const location: ITransVersion = {
        lat: property.location?.coordinates?.[1]?.toString() || null,
        lng: property.location?.coordinates?.[0]?.toString() || null,
      };

      return {
        ...property,
        price: property.price.toString(),
        visibility: property.status === 'AVAILABLE',
        address: {
          en: address.street || '',
          id: address.street || '',
        },
        location,
        table: {
          // rooms: specifications.kamar,
          bedrooms: specifications.bedrooms,
          bathrooms: specifications.bathrooms,
          // offices: specifications.offices,
        },

        description: property.description || {},
        jenis: {
          en: property.jenis || '',
          id: property.jenis || '',
        },
        luas: property.luas,
        type: property.type,
        land_size: parseInt(property.land_size, 10).toString(),
        name: property.name,
        detail_description: property.detail_description,
        status: property.status,
        contractType: (specifications as { contractType?: string }).contractType || '',
        propertyType: (specifications as { propertyType?: string }).propertyType || '',
        realEstateType: (specifications as { realEstateType?: string }).realEstateType || '',
        city: address.city || '',
        station: {},
        images: property.images || [],
      };
    });

    const sortResult = result
      .sort((a, b) => (a.id > b.id ? -1 : 1));
    setData(sortResult);
    setLoading(false);
  };

  const memoizedSortData = useMemo(
    () => sortData,
    // eslint-disable-next-line
    [],
  );

  return {
    data,
    loading,
    initialData,
  };
};

export default useDataFetching;

