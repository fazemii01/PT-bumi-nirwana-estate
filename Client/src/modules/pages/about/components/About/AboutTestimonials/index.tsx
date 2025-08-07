import { FC } from 'react';
import BlockTitle from '@modules/common/components/BlockTitle';
import Testimonial from '../../Testimonial';

import s from './AboutTestimonials.module.scss';
import { useTranslation } from 'react-i18next';

const AboutTestimonials: FC = () => {
	const { t } = useTranslation('common');

	const testimonials = [
		{
			name: 'TESTIMONIALS.CLIENT_1.NAME',
			position: 'TESTIMONIALS.CLIENT_1.POSITION',
			image: '/assets/property/source/999/client1.jpg',
			text: 'TESTIMONIALS.CLIENT_1.TEXT',
		},
		{
			name: 'TESTIMONIALS.CLIENT_2.NAME',
			position: 'TESTIMONIALS.CLIENT_2.POSITION',
			image: '/assets/property/source/999/client2.jpg',
			text: 'TESTIMONIALS.CLIENT_2.TEXT',
		},
	];

	return (
		<div className={s.testimonials}>
			<BlockTitle title={t('TESTIMONIALS.TITLE')} />
			<div className={s.testimonialCards}>
				{testimonials.map((testimonial) => (
					<Testimonial
						key={testimonial.name}
						name={t(testimonial.name)}
						position={t(testimonial.position)}
						image={testimonial.image}
						text={t(testimonial.text)}
					/>
				))}
			</div>
		</div>
	);
};

export default AboutTestimonials;