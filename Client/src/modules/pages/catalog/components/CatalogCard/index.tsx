import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import cn from 'classnames';

import DefaultPoster from '@modules/common/components/DefaultPoster';
import {
	formatToPrefixAndPrice
} from '@modules/pages/catalogPage/utils/formatters';
import { UNITS } from '@modules/pages/catalogPage/utils/units';
import IconFloorPlan from '@icons/components/IconFloorPlan';
import IconRuler from '@icons/components/IconRuler';

import {
	useCatalogItemFullAddress,
	useCurrencyFetching,
	// usePropertyPhoto,
} from '@hooks/index';
import { BACKEND_LOCALHOST, CATALOG_NAME, BACKEND_IMG } from '@utils/const';
import {
	formatCatalogTranslation,
	formatCityTranslation,
} from '@utils/formatters';

import type { ICatalogData } from '@t-types/data';

import s from './CatalogCard.module.scss';

const CatalogCard: FC<{
	props: ICatalogData;
}> = ({ props }) => {
	const {
		id,
		contractType,
		propertyType,
		city,
		street,
		province,
		price,
		address,
		description,
		realEstateType,
		table,
		location,
		images,
		luas,
		land_size,
		name,
		village,
		postal_code
	} = props;

	const { i18n, t: tCommon } = useTranslation('common');
	const { t: tCatalog } = useTranslation('catalog');
	const { currencyRate } = useCurrencyFetching();

	const mainImage = images?.find((image) => image.sort_order === 0) || null;

	const fullAddress = useCatalogItemFullAddress(
		realEstateType,
		location,
		address,
		city,
		street,
		province,
		village,
		postal_code,
	);
	const itemCity = tCommon(formatCityTranslation(city));
	const NameProperty = tCommon(formatCityTranslation(name));
	// const itemContractType = tCommon(formatCatalogTranslation(contractType));
	// const itemPropertyType = tCommon(formatCatalogTranslation(propertyType));
	// const itemTotalArea = Number(table.totalArea).toFixed();

	const totalRooms = Number(table.bedrooms) + Number(table.bathrooms);
	// console.log(`${name}:`, { bedrooms: table.bedrooms, bathrooms: table.bathrooms });
	return (
		<li className={cn('yellow-shadow', s.container)}>
			<Link className={s.inner} href={`/${CATALOG_NAME}/${id}`}>
				{mainImage ? (
					<Image
						className={s.image}
						width={400}
						height={300}
						// src={`${BACKEND_IMG}/storage/v1/object/public/building_images/${mainImage.image_url}`}
						src={mainImage.image_url}
						alt={mainImage.caption || `Image of ${name}`}
					/>

				) : (
					<DefaultPoster className={s.image} />
				)}
				<div className={s.info}>
					<ul className={s.tags}>
						{images &&
							images
								.sort((a, b) => a.sort_order - b.sort_order)
								.map(
									(image) =>
										image.caption && <li key={image.id}>{image.caption}</li>,
								)}
					</ul>
					<h3 className={s.name}>{NameProperty}</h3>
					<address className={s.address}>{`${village}${street}, ${itemCity}, ${province}, ${postal_code}`} <h5 className={s.description}>{description[i18n.language]}</h5></address>
					{/* <p className={s.description}>{description[i18n.language]}</p> */}
					<ul className={s.description}>

						{/* <li>
							{currencyRate &&
								formatToPrefixAndPrice(i18n.language, price, currencyRate)}
						</li> */}
						{/* {description && <p>{description[i18n.language]}</p>} */}


						{land_size && (
							<li title={tCatalog('TABLE.TOTALAREA')}>
								<IconRuler />
								{land_size + ' ' + UNITS[i18n.language].squareMeters}
							</li>
						)}
						{totalRooms > 0 && (
							<li title={tCatalog('TABLE.RUANGAN')}>
								<IconFloorPlan />
								{totalRooms}
							</li>
						)}

						{/* <li title={tCatalog('TABLE.TOTALAREA')}>
							<IconRuler />
							{land_size + ' ' + UNITS[i18n.language].squareMeters}
						</li>
						<li title={tCatalog('TABLE.RUANGAN')}>
							<IconFloorPlan />
							{totalRooms}
						</li> */}
					</ul>
				</div>
			</Link>
		</li>
	);
};

export default CatalogCard;
