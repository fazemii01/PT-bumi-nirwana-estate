import { FC } from 'react';
import Image from 'next/image';

import forest from './assets/forest.jpg';
import s from './AboutHero.module.scss';

const AboutHero: FC = () => {
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
					<h1>About Us</h1>
					<p>Your Trusted Partner in Property</p>
				</div>
			</div>
		</div>
	);
};

export default AboutHero;