import { FC } from 'react';

import s from './AboutMissionVision.module.scss';
import { useTranslation, Trans } from 'react-i18next';


const AboutMissionVision: FC = () => {
	const { t } = useTranslation('common');
	return (
		<div className={s.missionVision}>
			<div className={s.mission}>
				<h3>
					<Trans t={t} i18nKey="GOALS.MISSION">
						<strong />
					</Trans>
				</h3>
				<p>
					<Trans t={t} i18nKey="GOALS.SUB_1">
						<strong />
					</Trans>
				</p>
			</div>
			<div className={s.vision}>
				<h3>
					<Trans t={t} i18nKey="GOALS.VISIONS">
						<strong />
					</Trans>
				</h3>
				<p>
					<Trans t={t} i18nKey="GOALS.SUB_2">
						<strong />
					</Trans>
				</p>
			</div>
		</div>
	);
};

export default AboutMissionVision;