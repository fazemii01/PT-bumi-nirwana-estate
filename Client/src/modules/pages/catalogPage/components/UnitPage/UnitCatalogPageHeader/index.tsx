import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { formatToPrefixAndPrice } from '@modules/pages/catalogPage/utils/formatters';
import IconMap from '@icons/components/IconMap';
import Image from 'next/image';
import { BACKEND_LOCALHOST } from '@utils/const';
import { useCurrencyFetching } from '@hooks/index';
import { formatCaptionTranslation } from '@utils/formatters';

import s from './CatalogPageHeader.module.scss';


type ImageType = {
	id: string;
	image_url: string;
	caption: string;
	sort_order: number;
};

const CatalogPageHeader: FC<{
	city: string;
	address: string;
	// price: string;
	tags: string[];
	makau: string;
	images: ImageType[];
	province: string;
	village: string;
	postal_code: string;
	street: string;
}> = ({ city, images, makau}) => {
	const { t, i18n } = useTranslation('common');
	const { currencyRate } = useCurrencyFetching();

	// const finalPrice = currencyRate
	// 	? formatToPrefixAndPrice(i18n.language, price, currencyRate)
	// 	: '-';

	return (
		<>
			<article className={s.heading}>
				<h1 className={s.address}>{makau}</h1>
				{/* <p className={s.price}>{finalPrice}</p> */}
			</article>

			<article className={s.description}>
				<ul className={s.tags}>
					{images && images.length > 0 ? (
						images
							.sort((a, b) => a.sort_order - b.sort_order)
							.map((image) => {
								console.log("Image data:", image);
								return (
									image.caption && (
										<li key={image.id}>
											{t(formatCaptionTranslation(image.caption))}
										</li>
									)
								);
							})
					) : (
						<li>No captions available</li>
					)}
				</ul>

				<p className={s.city}>
					<IconMap />
					{city}
				</p>
			</article>
		</>
	);
};

export default CatalogPageHeader;

