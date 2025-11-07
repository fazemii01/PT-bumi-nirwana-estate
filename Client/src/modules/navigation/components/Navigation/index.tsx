import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { HeaderContext } from '@context/HeaderContext';
import cn from 'classnames';

import NavigationBurgerButton from '@modules/navigation/components/NavigationBurgerButton';
import NavigationContacts from '@modules/navigation/components/NavigationContacts';

import { useMediaQuery } from '@hooks/index';
import { CATALOG_NAME, TABLET_BREAKPOINT } from '@utils/const';

import s from './Navigation.module.scss';

interface INavigation {
	title: string;
	path: string;
}

const Navigation = () => {
	const isTablet = useMediaQuery(TABLET_BREAKPOINT);
	const { isMobileNavMode, handleMobileNavMode } = useContext(HeaderContext);
	const { t } = useTranslation('common');
	const { pathname } = useRouter();

	const NAVIGATION: INavigation[] = [
		{ title: 'MAIN', path: `/` },
		// { title: 'SERVICES', path: `/services` },
		{ title: 'ALL_REAL_ESTATE', path: `/${CATALOG_NAME}` },
		{ title: 'ABOUT', path: `/about` },
	];

	useEffect(() => {
		const element = document.querySelector('html');
		if (!isTablet) {
			handleMobileNavMode(false);
		}
		if (element) {
			element.setAttribute(
				'style',
				`${isMobileNavMode ? `overflow:hidden;` : ``}`,
			);
		}
		if (isMobileNavMode) {
            document.body.classList.add('menu-is-open');
        } else {
            document.body.classList.remove('menu-is-open');
        }

        return () => {
            document.body.classList.remove('menu-is-open');
        };
		// eslint-disable-next-line
	}, [isMobileNavMode, isTablet]);

	return (
		<>
			<nav
				onClick={() => handleMobileNavMode(false)}
				className={cn(s.container, isMobileNavMode && s.active)}
			>
				<ul className={s.list} onClick={(e) => e.stopPropagation()}>
					{NAVIGATION.map((item: INavigation) => (
						<li key={item.path} onClick={() => handleMobileNavMode(false)}>
							<Link
								href={item.path}
								className={cn(s.item, item.path === pathname && s.current)}
							>
								{t(`NAVIGATION.${item.title}`)}
							</Link>
						</li>
					))}
				</ul>

				<NavigationContacts />
			</nav>
			{isTablet && <NavigationBurgerButton />}
		</>
	);
};

export default Navigation;
