import { FC } from 'react';
import Image from 'next/image';

import forest from './assets/forest.jpg';
import s from './AboutHero.module.scss';
import { t } from 'i18next';
import { Trans, useTranslation } from 'react-i18next';

const AboutHero: FC = () => {
	const { t } = useTranslation('common');
	return (
		<div className={s.heroWrapper}>
			<div className={s.hero}>
				<Image
					src={forest}
					alt="About us hero"
					layout="fill"
					objectFit="cover"
				/>
				<div className={s.heroOverlay} />
				<div className={s.heroContent}>
					<h3>
						<Trans t={t} i18nKey="ABOUT_YOU.TITLE">
							<strong />
						</Trans>
					</h3>
					<p>
						<Trans t={t} i18nKey="ABOUT_YOU.SUB_1">
							<strong />
						</Trans>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AboutHero;