import React, { useEffect, useState } from 'react';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import s from './Map.module.scss';
import BlockTitle from '@modules/common/components/BlockTitle';
import { useTranslation } from 'react-i18next';

const Map = () => {
  const [Client, setClient] = useState<any>();

  useEffect(() => {
    (async () => {
      if (typeof window !== 'undefined') {
        const newClient = await import('./MapClient');
        setClient(() => newClient.default);
      }
    })();
  }, []);

  const position: LatLngExpression = [-8.107484724210996, 113.2319107966422];
  const { t: tHome } = useTranslation('common');
  return (
    <div className={s.container}>
      <BlockTitle title={tHome('MAP.TITLE')} />
      {Client && <Client position={position} />}
    </div>
  );
};

export default Map;
