import {useEffect, useMemo, useState} from 'react';

import {BACKEND_LOCALHOST} from '@utils/const';

import type { ICatalogData, ITransVersion, ICatalogTable } from '../types/data';
import type { Property } from '../types/property-entity';

const useDataFetching = () => {
  const initialData: ICatalogData = {
    city: '',
    contractType: '',
    id: 0,
    price: '',
    propertyType: '',
    realEstateType: '',
    station: {},
    visibility: false,
    description: {},
    address: {},
    location: {},
    table: {},
  };

  const [data, setData] = useState<ICatalogData[]>([initialData]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BACKEND_LOCALHOST}/properties`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data: Property[]) => memoizedSortData(data))
      .catch((error) => console.error('Error fetching data:', error));

    return () => controller.abort();
    // eslint-disable-next-line
  }, []);

  const sortData = (data: Property[]) => {
    const result = data.map((property: Property) => {
      const address = typeof property.address === 'string' ? JSON.parse(property.address) : property.address || {};
      const specifications = typeof property.specifications === 'string' ? JSON.parse(property.specifications) : property.specifications || {};

      const location: ITransVersion = {
        lat: property.location?.coordinates?.[1]?.toString() || null,
        lng: property.location?.coordinates?.[0]?.toString() || null,
      };

      return {
        ...initialData,
        id: parseInt(property.id, 10) || 0,
        price: property.price.toString(),
        visibility: property.status === 'AVAILABLE',
        description: {
          en: property.description,
        },
        address: {
          en: address.street || '',
        },
        location,
        table: specifications as ICatalogTable,
        contractType: (specifications as { contractType?: string }).contractType || '',
        propertyType: (specifications as { propertyType?: string }).propertyType || '',
        realEstateType: (specifications as { realEstateType?: string }).realEstateType || '',
        city: address.city || '',
        station: {},
      };
    });

    const sortResult = result
      .sort((a, b) => b.id - a.id);
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
