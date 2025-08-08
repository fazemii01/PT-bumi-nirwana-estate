import { useTranslation } from 'react-i18next';

import Filter from '@modules/common/components/Filter';
import Meta from '@modules/common/components/Meta';
import Feedback from '@modules/feedback/components/Feedback';
import HomeAdvantages from '@modules/pages/home/components/HomeAdvantages';
import HomeIntro from '@modules/pages/home/components/HomeIntro';
import HomeObjectsInManagement from '@modules/pages/home/components/HomeObjectsInManagement';
import HomePartners from '@modules/pages/home/components/HomePartners';
import HomeReviews from '@modules/pages/home/components/HomeReviews';
import HomeTeam from '@modules/pages/home/components/HomeTeam';
import HomeWhoWeAre from '@modules/pages/home/components/HomeWhoWeAre';
import Chatbot from '@modules/chatbot/components/Chatbot';
import Grid from '@modules/pages/home/components/Grid/container';


const Home = () => {
	const { t } = useTranslation('common');
	return (
		<>
			<Meta title={t('NAVIGATION.MAIN')} />
			<HomeIntro />
			<Filter />
			<HomeWhoWeAre />
			<HomeTeam />
			<HomeAdvantages />
			<Feedback type="cooperation" />
			{/* <Grid /> */}
			<HomeObjectsInManagement />
			<HomePartners />
			<HomeReviews />
			<Feedback type="owner" />
			<Chatbot />
		</>
	);
};

export default Home;
