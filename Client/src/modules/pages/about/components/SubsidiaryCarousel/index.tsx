import { FC } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';


import s from './SubsidiaryCarousel.module.scss';

interface ISubsidiary {
	name: string;
	logo: string;
}

interface ISubsidiaryCarouselProps {
	subsidiaries: ISubsidiary[];
}

const SubsidiaryCarousel: FC<ISubsidiaryCarouselProps> = ({ subsidiaries }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 2,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
				},
			},
		],
	};

	return (
		<div className={s.container}>
			<Slider {...settings}>
				{subsidiaries.map((subsidiary) => (
					<div key={subsidiary.name} className={s.slide}>
						<Image
							src={subsidiary.logo}
							alt={subsidiary.name}
							width={150}
							height={150}
						/>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default SubsidiaryCarousel;