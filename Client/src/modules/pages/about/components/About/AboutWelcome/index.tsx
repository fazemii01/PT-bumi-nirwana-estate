import { FC } from 'react';
import Image from 'next/image';
import cn from 'classnames';

import s from './AboutWelcome.module.scss';
import { useTranslation, Trans } from 'react-i18next';

const AboutWelcome: FC = () => {
	const { t } = useTranslation('home');
	return (
		<section className={cn(s.container, 'nude-bg')}>
			<article className={s.inner}>
				<p className={s.desc}>
					<Trans t={t} i18nKey="WHO_WE_ARE.ABOUT_US">
						<strong />
					</Trans>
				</p>
			</article>
		</section>
	);
	
};

export default AboutWelcome;