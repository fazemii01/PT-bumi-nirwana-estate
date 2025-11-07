import { FC, useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import dynamic from 'next/dynamic';

import { geocodeAddress } from '@utils/geocoding';

import s from './CatalogPageMap.module.scss';

const MapClient = dynamic(
  () => import('@modules/pages/home/components/MapTiller/MapClient'),
  {
    ssr: false,
  },
);

const CatalogPageMap: FC<{
  fullAddress: string;
}> = ({ fullAddress }) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    const getPosition = async () => {
      const coordinates = await geocodeAddress(fullAddress);
      if (coordinates) {
        setPosition(coordinates);
      }
    };

    getPosition();
  }, [fullAddress]);

  if (!position) {
    return <div>Loading map...</div>;
  }
  
  return (
    <div className={s.container}>
      <MapClient position={position} />
    </div>
  );
};

export default CatalogPageMap;
