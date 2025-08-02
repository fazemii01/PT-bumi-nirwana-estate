import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useMediaQuery } from '@hooks/index';
import { LAPTOP_BREAKPOINT, TABLET_BREAKPOINT } from '@utils/const';

import NEW_LOGO from '../../../../assets/icons/20250801_140054.svg';

const Logo: FC<{ type?: 'white' | 'black' }> = ({ type = 'black' }) => {
	const isTablet = useMediaQuery(TABLET_BREAKPOINT);
	const isLaptop = useMediaQuery(LAPTOP_BREAKPOINT);

	const width = isTablet ? 100 : isLaptop ? 130 : 140;
	const height = isTablet ? 50 : isLaptop ? 42 : 59;

	return (
		<Link href="/">
			<Image
				src={NEW_LOGO}
				alt="Logo"
				width={width}
				height={height}
			/>
		</Link>
	);
};

export default Logo;
