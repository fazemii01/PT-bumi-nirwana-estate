import React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './ListItem.module.scss';
import { useMediaQuery, usePropertyPhoto } from '@hooks/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBath, faBed, faKitchenSet, faThumbsUp, faWarehouse } from '@fortawesome/free-solid-svg-icons'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import {
  LAPTOP_BREAKPOINT,
  BACKEND_LOCALHOST
} from '@utils/const';

import type { ICatalogListItemProps,} from '@t-types/data';

const CatalogListItem: FC<ICatalogListItemProps> = ({
  id_item,
  building_description,
  building_images,
  name,
}) => {
  const { t } = useTranslation('catalog');
  const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= Math.floor(rating) ? styles.starFilled : styles.starEmpty}>
          ★
        </span>
      );
    }
    return stars;
  };
  
  const mainImage = building_images?.find((image) => image.sort_order === 0) || null;
  // console.log("Main image:", mainImage);
  // console.log("Full path:", `${BACKEND_LOCALHOST}/uploads/building_property/building_images/${mainImage?.image_url}`);

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        
        <div className={styles.filters}>
          <button className={styles.filterBtn}>Highest Price</button>
          <button className={styles.filterBtn}>Lowest Price</button>
          <button className={styles.filterBtn}>Median Price</button>
        </div>
      </header> */}

      {/* <div className={styles.listingContainer}> */}

      <div key={id_item} className={styles.card}>
        <div className={styles.cardContent}>
          <div className={styles.info}>
            <span className={styles.district}>{ }</span>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.description}>{building_description}</p>

          </div>
          <div className={styles.imageSection}>
            <button className={styles.favoriteBtn}>♡</button>
            {mainImage ? (
              <img
                className={styles.image}
                // src={`${BACKEND_LOCALHOST}/uploads/building_property/building_images/${mainImage.image_url}`}
                src={mainImage.image_url}
                alt={mainImage.caption || name}
              />
            ) : (
              <div className={styles.defaultImage} />
            )}
          </div>
        </div>
        <div className={styles.description}>
          <ul>
            <li>
              <FontAwesomeIcon icon={faWarehouse} />
              <FontAwesomeIcon icon={faBed} />
              <FontAwesomeIcon icon={faKitchenSet} />
              <FontAwesomeIcon icon={faBath} />
            </li>
          </ul>
        </div>
      </div>

    </div>


  );
};
export default CatalogListItem;
