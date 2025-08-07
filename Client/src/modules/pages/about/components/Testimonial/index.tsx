import { FC } from 'react';
import Image from 'next/image';

import s from './Testimonial.module.scss';

interface ITestimonialProps {
	name: string;
	position: string;
	image: string;
	text: string;
}

const Testimonial: FC<ITestimonialProps> = ({ name, position, image, text }) => {
	return (
		<div className={s.container}>
			<div className={s.image}>
				<Image src={image} alt={name} width={100} height={100} />
			</div>
			<div className={s.content}>
				<p className={s.text}>{text}</p>
				<h4 className={s.name}>{name}</h4>
				<p className={s.position}>{position}</p>
			</div>
		</div>
	);
};

export default Testimonial;