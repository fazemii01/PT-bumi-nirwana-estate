import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Meta from '@modules/common/components/Meta';
import Feedback from  './Feedback';

import AboutHero from './AboutHero';
import AboutWelcome from './AboutWelcome';
import AboutMissionVision from './AboutMissionVision';
import Map from '@modules/pages/home/components/MapTiller/Map';

import AboutTestimonials from './AboutTestimonials';

const About: FC = () => {
	const { t } = useTranslation('common');

	return (
		<>
			<Meta title={t('NAVIGATION.ABOUT')} />
			<AboutHero />
			<AboutWelcome />
			<AboutMissionVision />
			<AboutTestimonials />
			<Map />
			<Feedback type='cooperation'/>
			
		</>
	);
};

export default About;
