import {FC} from 'react';
import {useTranslation} from 'react-i18next';
import cn from 'classnames';

import CatalogPageMap
	from '@modules/pages/catalogPage/components/CatalogPageMap';
import CatalogPageNotice
	from '@modules/pages/catalogPage/components/CatalogPageNotice';
import CatalogPageTable
	from '@modules/pages/catalogPage/components/CatalogPageTable';
import CatalogPageVideo
	from "@modules/pages/catalogPage/components/CatalogPageVideo";

import {useMediaQuery, usePropertyPhoto} from '@hooks/index';
import {LAPTOP_BREAKPOINT} from '@utils/const';

import type {ICatalogTable} from '@t-types/data';

import s from './CatalogPageInformation.module.scss';

const CatalogPageInformation: FC<{
	detail_description: string;
	id: string;
	tableInfo: ICatalogTable;
	address: string;
	originalAddress: string;
	station: string;
	contractType: string;
	realEstateType: string;
	price: string;
	jenis: string;
	luas: string;
	status: string;
}> = ({
	      detail_description,
	      tableInfo,
	      id,
	      address,
	      originalAddress,
	      station,
	      realEstateType,
	      contractType,
	      price,
	      jenis,
		  luas,
		  status
	     }) => {
	const {t} = useTranslation('catalog');
	const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);
	// const isVideoBlock = postersList.some(item => item.video);

	return (
		<>
			

			<article className={cn(s.container, s.info)}>
				<h4 className={s.title}>{t('INFORMATION')}</h4>
				<hr className={s.line}/>
				<div className={s.infoHeading}>
					
					<p>
						{t('OBJECT_ID')} <span className={s.id}>{id.toString().substring(0, 4)}</span>
					</p>
				</div>

				<CatalogPageTable
					price={price}
					contractType={contractType}
					realEstateType={realEstateType}
					tableInfo={tableInfo}
					jenis={jenis}
					luas={luas}
					status={status}
				/>

				<CatalogPageNotice type="short"/>
			</article>

			<article className={cn(s.container)}>
				<h4 className={s.title}>{t('DESCRIPTION')}</h4>
				<hr className={s.line}/>
				{detail_description && <ul className={s.descriptionList}>
					{detail_description.split("\n").map((line, index) => (
						<li key={index}>{line.replace(/^- /, '')}</li>
					))}
				</ul>}
			</article>

			<article className={cn(s.container, s.address)}>
				<h4 className={s.title}>{t('ADDRESS')}</h4>
				<hr className={s.line}/>
				{address && <p>{address}</p>}
				{station && <p>{station}</p>}
				<CatalogPageMap fullAddress={originalAddress}/>
			</article>

			{!isLaptop && <CatalogPageNotice/>}
		</>
	);
};

export default CatalogPageInformation;
