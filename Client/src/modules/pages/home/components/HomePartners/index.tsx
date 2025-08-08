import { useTranslation } from 'react-i18next';
import Image from 'next/image';

import CardSlider from '@modules/common/components/CardSlider';

import { useMediaQuery } from '@hooks/index';
import {
	LAPTOP_BREAKPOINT,
	MOBILE_BREAKPOINT,
	TABLET_BREAKPOINT,
} from '@utils/const';


import RA from './assets/RA LOGO.png';
import MARGO from './assets/margojoyo logo.png';
import BUMI from './assets/Bumi Logo.png';


import s from './HomePartners.module.scss';

const Partners = () => {
	const partnersList = [
		RA,
		MARGO,
		BUMI
	];
	const { t } = useTranslation('common');
	const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
	const isTablet = useMediaQuery(TABLET_BREAKPOINT);
	const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);
	const slidesToShow = isMobile ? 2 : isTablet ? 3 : isLaptop ? 3 : 4;

	return (
		<CardSlider
			frameClassName={s.container}
			withoutControls
			childrenClassName={s.item}
			slidesToShow={slidesToShow}
			dragging={isTablet}
		>
			{partnersList.map((item, i) => (
				<Image key={i} src={item} alt={t('IMAGE')} />
			))}
		</CardSlider>
	);
};

export default Partners;
