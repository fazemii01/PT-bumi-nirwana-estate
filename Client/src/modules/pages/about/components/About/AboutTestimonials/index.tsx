import { FC } from 'react';
import BlockTitle from '@modules/common/components/BlockTitle';
import Testimonial from '../../Testimonial';

import s from './AboutTestimonials.module.scss';
import { useTranslation } from 'react-i18next';
import MARGOJOYO from './assets/margojoyo.png';

const AboutTestimonials: FC = () => {
	const { t } = useTranslation('common');

	const testimonials = [
		{
			name: 'TESTIMONIALS.CLIENT_1.NAME',
			position: 'TESTIMONIALS.CLIENT_1.POSITION',
			image: MARGOJOYO,
			text: 'TESTIMONIALS.CLIENT_1.TEXT',
		},
	
	];

	return (
		<div className={s.testimonials}>
			<BlockTitle title={t('TESTIMONIALS.TITLE')} />
			<div className={s.testimonialCards}>
				{testimonials.map((testimonial) => (
					<Testimonial
						key={testimonial.name}
						text={t(testimonial.text)}
						name={t(testimonial.name)}
						position={t(testimonial.position)}
						image={testimonial.image}
					/>
				))}
			</div>
		</div>
	);
};

export default AboutTestimonials;