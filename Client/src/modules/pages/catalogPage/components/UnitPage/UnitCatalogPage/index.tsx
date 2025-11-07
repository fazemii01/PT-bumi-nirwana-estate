import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import Loader from '@modules/common/components/Loader';
import Meta from '@modules/common/components/Meta';
import FeedbackForm from '@modules/feedback/components/FeedbackForm';
import CatalogPageCarousel from '@modules/pages/catalogPage/components/UnitPage/UnitCatalogPageCarousel';
import CatalogPageCrumbs from '@modules/pages/catalogPage/components/UnitPage/UnitCatalogPageCrumbs';
import CatalogPageHeader from '@modules/pages/catalogPage/components/UnitPage/UnitCatalogPageHeader';
import CatalogPageInformation from '@modules/pages/catalogPage/components/UnitPage/UnitCatalogPageInformation';
import CatalogPageNotice from '@modules/pages/catalogPage/components/UnitPage/UnitCatalogPageNotice';
import ProfileCard from '@modules/pages/catalogPage/components/ProfileCard';
import { formatMetaForCatalogPage } from '@modules/pages/catalogPage/utils/formatters';

import {
    useCatalogItemFullAddress, // <-- We are still using this
    useDataFetching,
    useMediaQuery,
} from '@hooks/index';
import { LAPTOP_BREAKPOINT } from '@utils/const';
import {
    formatCatalogTranslation,
    formatCityTranslation,
    formatTranslation,
} from '@utils/formatters';


import type { ICatalogData, IBuildingProperty } from '@t-types/data';

import s from './CatalogPage.module.scss';
import Page404 from "@modules/pages/page404/components/Page404";

interface UnitCatalogPageProps {
    catalogId: string;
    unitId?: string;
}

const UnitCatalogPage: FC<UnitCatalogPageProps> = ({ catalogId: propCatalogId, unitId: propUnitId }) => {

    const router = useRouter();
    const { t: tCommon, i18n } = useTranslation('common');
    const { t: tCatalog } = useTranslation('catalog');
    const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);

    const { data, loading } = useDataFetching();

    const propertyId = propCatalogId || router.query.catalog;
    const unitId = propUnitId || router.query.unitId;

    const [pageData, setPageData] = useState<ICatalogData | null>(null);
    const [selectedUnit, setSelectedUnit] = useState<IBuildingProperty | null>(null);


    const parsedAddress = (pageData?.address && typeof pageData.address === 'string')
        ? JSON.parse(pageData.address)
        : (pageData?.address || {});


    const itemLocationAndAddress = useCatalogItemFullAddress(
        pageData?.realEstateType ?? '',
        pageData?.location ?? {},
        parsedAddress ?? {},
        parsedAddress?.city ?? '',
        parsedAddress?.street ?? '',
        parsedAddress?.province ?? '',
        parsedAddress?.village ?? '',
        parsedAddress?.postal_code ?? '',
    );
    

    useEffect(() => {
        if (!router.isReady || loading || !propertyId) return;

        const foundParent = data.find(
            (property: ICatalogData) => property.id === propertyId
        );

        if (!foundParent) {
            setPageData(null);
            return;
        }

        setPageData(foundParent);

        if (unitId) {
            const foundUnit = foundParent.building_property.find(
                (unit: IBuildingProperty) => unit.id === unitId
            );
            setSelectedUnit(foundUnit || null);
        } else {
            setSelectedUnit(null);
        }

    }, [data, propertyId, unitId, router.isReady, loading, propCatalogId, propUnitId]);


    if (loading) {
        return <Loader type="fullscreen" />;
    }

    if (!pageData) {
        return <Page404 />;
    }

    if (unitId && !selectedUnit) {
        return <Page404 />;
    }

    const parsedUnitSpecs = (selectedUnit && typeof selectedUnit.specifications === 'string')
        ? JSON.parse(selectedUnit.specifications)
        : (selectedUnit?.specifications || {});


    const displayName = selectedUnit?.name ?? pageData.name;
    const displayImages = selectedUnit?.images ?? pageData.images;
    const displayPrice = selectedUnit?.price.toString() ?? pageData.price;
    const displayDescription = selectedUnit?.description ?? pageData.detail_description;
    const displayStatus = selectedUnit?.status ?? pageData.status;
    const displayLandSize = selectedUnit?.land_size ?? pageData.land_size;
    const displayTableInfo = selectedUnit ? parsedUnitSpecs : pageData.table;
    const displayFloor_plans = selectedUnit?.floor_plans ?? pageData.floor_plans;
    const displayPriceUnit = selectedUnit?.price_unit ?? '';
    const total_units = selectedUnit?.total_units ?? 0;

    const {
        id: parentId,
        agent,
        developer,
        contractType,
        propertyType,
        realEstateType,
        station,
        jenis,
        type,
        name,
        floor_plans,
        images,
      
    } = pageData;

    const {
        city = '',
        street = '',
        province = '',
        village = '',
        postal_code = ''
    } = parsedAddress;

    const realEstateTranslation = tCommon(formatCatalogTranslation(realEstateType));
    const itemTags = [propertyType, realEstateType];
    const itemD = [city, street, province, village, postal_code].filter(Boolean).join(', ');

    const itemStation = formatTranslation(i18n.language, station);
    const itemJenis = formatTranslation(i18n.language, jenis);



    const itemCity = tCommon(formatCityTranslation(city));

    const itemRealEstateTypeAndAddress = `${realEstateTranslation} ${tCommon('ON')} ${itemLocationAndAddress}`;


    const pageMetaDescription = formatMetaForCatalogPage(
        city,
        street,
        realEstateType,
    );

    const primaryAgent = agent && agent.length > 0 ? agent[0] : null;
    const primaryDeveloper = developer && developer.length > 0 ? developer[0] : null;

    return (
        <>
            <Meta title={displayName} desc={pageMetaDescription} />

            <CatalogPageCrumbs
                address={itemRealEstateTypeAndAddress}
                name={displayName}
            />

            <CatalogPageHeader
                city={itemCity}
                address={itemLocationAndAddress}
                makau={itemD}
                tags={itemTags}
                images={displayImages}
                province={province}
                village={village}
                postal_code={postal_code}
                street={street}
                name={displayName}

            />

            <section className={s.container}>
                <div>
                    <CatalogPageCarousel
                        images={displayImages} floorPlans={displayFloor_plans}
                    />

                    <CatalogPageInformation
                        contractType={contractType}
                        realEstateType={realEstateType}
                        id={selectedUnit?.id ?? parentId}
                        detail_description={displayDescription}
                        tableInfo={displayTableInfo || {}}
                        address={itemLocationAndAddress}
                        originalAddress={itemD}
                        station={itemStation}
                        jenis={itemJenis}
                        luas={displayLandSize}
                        status={displayStatus}
                        land_size={displayLandSize}
                        type={type}
                        building_property={pageData.building_property || []}
                        agent={pageData.agent || []}
                    />
                </div>

                <aside>
                    <div className={s.feedback}>
                        <h5 className={s.feedbackTitle}>
                            {tCatalog('TITLE_AGENT')}
                        </h5>

                        {primaryAgent && (
                            <ProfileCard
                                id={primaryAgent.id}
                                full_name={primaryAgent.full_name}
                                phone_number={primaryAgent.phone_number}
                                email={primaryAgent.email}
                                website={primaryAgent.website}
                                avatar_url={primaryAgent.avatar_url}
                                name={primaryDeveloper?.name || ''}
                                website_url={primaryDeveloper?.website_url || ''}
                                logo_url={primaryDeveloper?.logo_url || ''}
                            />
                        )}

                        <br />

                        {/* <h5 className={s.feedbackTitle}>
                            {tCatalog('TITLE_MARGO')}
                        </h5>
                        <p className={s.feedbackDescription}>
                            {tCatalog('MARGOJOYO')}
                        </p> */}

                    </div>
                   
                </aside>
                <aside>
                    <div className={s.feedback}>
                        <FeedbackForm isColumnType message={`${itemLocationAndAddress} - ${displayName}`} />
                    </div>
                </aside>
            </section>

            {isLaptop && <CatalogPageNotice />}
        </>
    );
};

export default UnitCatalogPage;