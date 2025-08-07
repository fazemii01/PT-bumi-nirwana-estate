import { FC } from 'react';

import s from './AboutMissionVision.module.scss';

const AboutMissionVision: FC = () => {
	return (
		<div className={s.missionVision}>
			<div className={s.mission}>
				<h3>Our Mission</h3>
				<p>
					To create exceptional living and working spaces that enhance the
					quality of life for our customers and contribute to the sustainable
					development of our communities.
				</p>
			</div>
			<div className={s.vision}>
				<h3>Our Vision</h3>
				<p>
					To be the leading property developer in the region, known for our
					commitment to quality, innovation, and customer satisfaction.
				</p>
			</div>
		</div>
	);
};

export default AboutMissionVision;