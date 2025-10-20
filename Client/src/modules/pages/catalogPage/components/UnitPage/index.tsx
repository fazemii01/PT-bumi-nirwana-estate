// pages/catalog/detail-unit/[unitId].tsx

import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';


import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import ReactMarkdown from 'react-markdown';


import { useDataFetching, useMediaQuery } from '@hooks/index';
import { BACKEND_LOCALHOST, LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '@utils/const';
import { UNITS } from '@modules/pages/catalogPage/utils/units';


import Loader from '@modules/common/components/Loader';
import Page404 from '@modules/pages/page404/components/Page404';
import CatalogPageMap from '@modules/pages/catalogPage/components/CatalogPageMap';
import IconSliderButton from '@icons/components/IconSliderButton';
import IconMap from '@icons/components/IconMap';


import type { ICatalogData, ICatalogTable, IBuildingProperty } from '@t-types/data';


import s from './UnitPage.module.scss';


const UnitPage: FC = () => {
    const router = useRouter();
    const { t } = useTranslation(['common', 'catalog']);
    
    // 1. DATA FETCHING AND STATE MANAGEMENT
    // =================================================================
    const { catalog: catalogId, unitId } = router.query;
    const { data: allProperties, loading } = useDataFetching();
    
    const [propertyData, setPropertyData] = useState<ICatalogData | null>(null);
    const [unitData, setUnitData] = useState<IBuildingProperty | null>(null);

    useEffect(() => {
        if (loading || !router.isReady) return;

        const foundProperty = allProperties.find(p => p.id === catalogId);
        if (foundProperty) {
            setPropertyData(foundProperty);
            const foundUnit = foundProperty.building_property.find(u => u.id === unitId);
            setUnitData(foundUnit || null);
        } else {
            setPropertyData(null);
            setUnitData(null);
        }
    }, [loading, router.isReady, allProperties, catalogId, unitId]);

    // Media query for responsive design
    const isTablet = useMediaQuery(TABLET_BREAKPOINT);
    const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);

    
    // 2. UI RENDERING LOGIC
    // =================================================================

    if (loading || !router.isReady) {
        return <Loader type="fullscreen" />;
    }

    if (!propertyData || !unitData) {
        return <Page404 />;
    }

    // Prepare images for the gallery from the specific unit's data
    const galleryImages = unitData.images.map(img => ({
        original: `${BACKEND_LOCALHOST}/uploads/building_property/building_images/${img.image_url}`,
        thumbnail: `${BACKEND_LOCALHOST}/uploads/building_property/building_images/${img.image_url}`,
        originalAlt: img.caption || unitData.name,
        thumbnailAlt: img.caption || unitData.name,
    }));

    // Combine address parts for display
    const fullAddress = [
        propertyData.street,
        propertyData.village,
        propertyData.city,
        propertyData.province,
        propertyData.postal_code,
    ].filter(Boolean).join(', ');


    return (
        <div className={s.pageContainer}>
            {/* ## Section 1: Header (from CatalogPageHeader) ## */}
            <article className={s.header}>
                <h1 className={s.headerTitle}>{unitData.name}</h1>
                <p className={s.headerAddress}>
                    <IconMap />
                    {fullAddress}
                </p>
            </article>

            <section className={s.mainContent}>
                <div className={s.leftColumn}>
                    {/* ## Section 2: Image Carousel (from CatalogPageCarousel) ## */}
                    <article className={s.carouselContainer}>
                        {galleryImages.length > 0 ? (
                            <ImageGallery
                                items={galleryImages}
                                showNav={!isTablet}
                                showThumbnails={!isTablet}
                                showPlayButton={false}
                                showBullets
                                lazyLoad
                                renderLeftNav={(onClick, disabled) => (
                                    <button className={s.prevButton} onClick={onClick} disabled={disabled}>
                                        <IconSliderButton />
                                    </button>
                                )}
                                renderRightNav={(onClick, disabled) => (
                                    <button className={s.nextButton} onClick={onClick} disabled={disabled}>
                                        <IconSliderButton />
                                    </button>
                                )}
                            />
                        ) : (
                            <div className={s.defaultPoster}>No Images Available</div>
                        )}
                    </article>
                    
                    {/* ## Section 3: Information & Description (from CatalogPageInformation) ## */}
                    <article className={cn(s.infoCard, s.descriptionCard)}>
                        <h4 className={s.infoTitle}>{t('catalog:DESCRIPTION')}</h4>
                        <hr className={s.line} />
                        <div className={s.descriptionContent}>
                           {/* Assuming description supports Markdown for rich text formatting */}
                           <ReactMarkdown>{unitData.description}</ReactMarkdown>
                        </div>
                    </article>

                    {/* ## Section 4: Address and Map (from CatalogPageInformation) ## */}
                     <article className={cn(s.infoCard, s.addressCard)}>
                        <h4 className={s.infoTitle}>{t('catalog:ADDRESS')}</h4>
                        <hr className={s.line} />
                        <p>{fullAddress}</p>
                        <CatalogPageMap fullAddress={fullAddress} />
                    </article>
                </div>

                <aside className={s.rightColumn}>
                    {/* ## Section 5: Specifications Table (from CatalogPageTable) ## */}
                    <article className={s.infoCard}>
                        <h4 className={s.infoTitle}>{t('catalog:INFORMATION')}</h4>
                        <hr className={s.line} />
                        <table className={s.specTable}>
                            <tbody>
                                <tr>
                                    <td>{t('catalog:LAND_SIZE')}</td>
                                    <td>{`${unitData.land_size} ${UNITS['en'].squareMeters}`}</td>
                                </tr>
                                <tr>
                                    <td>{t('catalog:BUILDING_SIZE')}</td>
                                    <td>{`${unitData.building_size} ${UNITS['en'].squareMeters}`}</td>
                                </tr>
                                {/* You can add more rows here for other unit-specific data if available */}
                                {unitData.specifications?.bedrooms && (
                                     <tr>
                                        <td>{t('catalog:TABLE.BEDROOMS')}</td>
                                        <td>{unitData.specifications.bedrooms}</td>
                                    </tr>
                                )}
                                {unitData.specifications?.bathrooms && (
                                     <tr>
                                        <td>{t('catalog:TABLE.BATHROOMS')}</td>
                                        <td>{unitData.specifications.bathrooms}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </article>

                    {/* You can add a feedback/contact form here as well */}
                </aside>
            </section>
        </div>
    );
};

export default UnitPage;