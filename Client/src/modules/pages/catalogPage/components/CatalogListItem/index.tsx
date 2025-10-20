import React from 'react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './ListItem.module.scss';
import { useMediaQuery, usePropertyPhoto } from '@hooks/index';
import {
  LAPTOP_BREAKPOINT,
  BACKEND_LOCALHOST
} from '@utils/const';

import type { ICatalogListItemProps } from '@t-types/data';
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
    // <div className={styles.container}>
      // {/* <header className={styles.header}>
      //   <button className={styles.menuBtn}>☰</button>
      //   <button className={styles.gridBtn}>⊞</button>
      //   <div className={styles.filters}>
      //     <button className={styles.filterBtn}>Highest Price</button>
      //     <button className={styles.filterBtn}>Lowest Price</button>
      //     <button className={styles.filterBtn}>Median Price</button>
      //   </div>
      // </header> */}

      // {/* <div className={styles.listingContainer}> */}

        <div key={id_item} className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.info}>
              <span className={styles.district}>{ }</span>
              <h2 className={styles.name}>{name}</h2>
              <p className={styles.description}>{building_description}</p>

              {/* <div className={styles.rating}>
                <div className={styles.stars}>{renderStars(rating)}</div>
                <span className={styles.ratingNumber}>{rating}</span>
                <span className={styles.reviewCount}>{reviewCount} reviews</span>
              </div> */}

              {/* <div className={styles.features}>
                {acceptDelivery && (
                  <div className={styles.feature}>
                    <span className={styles.icon}>✓</span>
                    <span>Accept Delivery</span>
                  </div>
                )}
                {noDelivery && (
                  <div className={styles.feature}>
                    <span className={styles.icon}>⊗</span>
                    <span>No Delivery</span>
                  </div>
                )}
                {distance && (
                  <div className={styles.feature}>
                    <span className={styles.icon}>📍</span>
                    <span>{distance}</span>
                  </div>
                )}
                {freeRefund && (
                  <div className={styles.feature}>
                    <span className={styles.icon}>↻</span>
                    <span>Free Refund</span>
                  </div>
                )}
                {acceptDigitalApp && (
                  <div className={styles.feature}>
                    <span className={styles.icon}>📱</span>
                    <span>Accept Digital App</span>
                  </div>
                )}
              </div> */}

              {/* <div className={styles.price}>
                {priceRange} <span className={styles.currency}>USD</span>
              </div> */}
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
        </div>


  );
};
export default CatalogListItem;
