import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

import Loader from '@modules/common/components/Loader';
import Meta from '@modules/common/components/Meta';
import FeedbackForm from '@modules/feedback/components/FeedbackForm';
import CatalogPageCarousel
	from '@modules/pages/catalogPage/components/CatalogPageCarousel';
import CatalogPageCrumbs
	from '@modules/pages/catalogPage/components/CatalogPageCrumbs';
import CatalogPageHeader
	from '@modules/pages/catalogPage/components/CatalogPageHeader';
import CatalogPageInformation
	from '@modules/pages/catalogPage/components/CatalogPageInformation';
import CatalogPageNotice
	from '@modules/pages/catalogPage/components/CatalogPageNotice';
import CatalogPageTable
	from '@modules/pages/catalogPage/components/CatalogPageTable';
import CatalogListItem
	from '@modules/pages/catalogPage/components/CatalogListItem';

import {
	formatMetaForCatalogPage
} from '@modules/pages/catalogPage/utils/formatters';

import {
	useCatalogItemFullAddress,
	useDataFetching,

	useMediaQuery,
} from '@hooks/index';
import { CATALOG_NAME, LAPTOP_BREAKPOINT } from '@utils/const';
import {
	formatCatalogTranslation,
	formatCityTranslation,
	formatTranslation,
} from '@utils/formatters';

import type { ICatalogData, ICatalogListItemProps } from '@t-types/data';

import s from './CatalogPage.module.scss';
import Page404 from "@modules/pages/page404/components/Page404";

const CatalogPage: FC = () => {
	// const router = useRouter();
	// const {catalog} = router.query;
	// const {data, loading, initialData} = useDataFetching();
	// const {i18n, t: tCommon} = useTranslation('common');
	// const {t: tCatalog} = useTranslation('catalog');
	// const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);
	// const currentPageId = catalog;
	// const [pageData, setPageData] = useState<ICatalogData>(initialData);

	const router = useRouter();
	const { catalog: currentPageId } = router.query;
	const { data, loading } = useDataFetching();
	const { i18n, t: tCommon } = useTranslation('common');
	const { t: tCatalog } = useTranslation('catalog');
	const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);
	const [pageData, setPageData] = useState<ICatalogData | null>(null);

	// const itemLocationAndAddress = useCatalogItemFullAddress(
	//     pageData?.realEstateType,
	//     pageData?.location,
	//     pageData?.address,
	// );
	const itemLocationAndAddress = useCatalogItemFullAddress(
		pageData?.realEstateType ?? '',
		pageData?.location ?? {},
		pageData?.address ?? {},
		pageData?.city ?? '',
		pageData?.street ?? '',
		pageData?.province ?? '',
		pageData?.village ?? '',
		pageData?.postal_code ?? '',

	);

	useEffect(() => {
		if (!router.isReady || loading) return;
		const foundItem = data.find((value: ICatalogData) => value.id === currentPageId);
		setPageData(foundItem || null);

	}, [data, currentPageId, router.isReady, loading]);

	if (loading) {
		return <Loader type="fullscreen" />;
	}
	if (!pageData) {
		return <Page404 />
	}
	const {
		address,
		city,
		province,
		village,
		street,
		postal_code,
		
		description,
		detail_description,
		id,
		price,
		propertyType,
		realEstateType,
		station,
		table,
		location,
		contractType,
		images,
		floor_plans,
		site_plans,
		luas,
		jenis,
		status,
		land_size,
		type
	} = pageData;


	// useEffect(() => {
	// 	if (!router.isReady) return;
	// 	data.map((value: ICatalogData) => {
	// 		if (value.id === currentPageId) {
	// 			setPageData(value);
	// 		}
	// 	});

	// 	// eslint-disable-next-line
	// }, [data, router.query.catalog, router.isReady]);

	const realEstateTranslation = tCommon(
		formatCatalogTranslation(realEstateType),
	);

	const itemTags = [propertyType, realEstateType];
	const itemD = [city, street, province, village, postal_code]
    .filter(Boolean) 
    .join(', ');     
	const itemAddress = formatTranslation(i18n.language, address);
	const itemStation = formatTranslation(i18n.language, station);
	const itemLocation = formatTranslation(i18n.language, location);
	const itemDescription = detail_description;
	const itemJenis = formatTranslation(i18n.language, jenis);
	const itemCity = tCommon(formatCityTranslation(city));
	// const itemLuas = luas;
	const itemOriginalFullAddress = `${city}, ${location.ua}, ${address.ua}`;
	const itemCityWithLocationAndAddress = `${itemCity}, ${itemLocation}, ${itemAddress}`;
	const itemRealEstateTypeAndAddress = `${realEstateTranslation} ${tCommon(
		'ON',
	)} ${itemAddress}`;
	

	// const itemLocationAndAddress = useCatalogItemFullAddress(
	// 	realEstateType,
	// 	location,
	// 	address,
	// );

	const pageMetaDescription = formatMetaForCatalogPage(
		city,
		address.ua as keyof typeof address,
		realEstateType,
	);

	if (loading) {
		return <Loader type="fullscreen" />;
	}

	if (pageData.id === '0' || !pageData.id) {
		return <Page404 />
	}

	return (
		<>
			<Meta title={itemLocationAndAddress} desc={pageMetaDescription} />

			<CatalogPageCrumbs address={itemRealEstateTypeAndAddress} />
			<CatalogPageHeader
				city={itemCity}
				address={itemLocationAndAddress}
				// price={price}
				makau={itemD}
				tags={itemTags}
				images={images} 
				province={''} 
				village={''} 
				postal_code={''} 
				street={''} 
				/>
			<section className={s.container}>
				<div>
					{id && <CatalogPageCarousel images={images} sitePlans={site_plans} />}
					
					<CatalogPageInformation
						contractType={contractType}
						realEstateType={realEstateType}
						id={id}
						detail_description={itemDescription}
						tableInfo={table || {}}
						address={itemCityWithLocationAndAddress}
						originalAddress={itemOriginalFullAddress}
						station={itemStation}
						price={price}
						jenis={itemJenis}
						luas={land_size}
						status={status}
						land_size={land_size}
						type={type}
						building_property={pageData.building_property || []}
					/>
				</div>
				
				<aside>
					<div className={s.feedback}>
						<h5 className={s.feedbackTitle}>
							{tCatalog('FEEDBACK.DO_YOU_LIKE_THIS_PROPERTY')}
						</h5>
						<p className={s.feedbackDescription}>
							{tCatalog('FEEDBACK.IF_YOU_LIKE_THIS_PROPERTY')}
						</p>
						<FeedbackForm isColumnType message={itemLocationAndAddress} />
					</div>
				</aside>
			</section>

			{isLaptop && <CatalogPageNotice />}
		</>
	);
};
export default CatalogPage;
