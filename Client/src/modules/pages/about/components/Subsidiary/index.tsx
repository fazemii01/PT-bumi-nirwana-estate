import { FC } from 'react';
import Image from 'next/image';

import s from './Subsidiary.module.scss';

interface ISubsidiaryProps {
	name: string;
	description: string;
	logo: string;
	projectImage: string;
}

const Subsidiary: FC<ISubsidiaryProps> = ({ name, description, logo, projectImage }) => {
	return (
		<div className={s.container}>
			<div className={s.logo}>
				<Image src={logo} alt={name} width={100} height={100} />
			</div>
			<div className={s.content}>
				<h3 className={s.name}>{name}</h3>
				<p className={s.description}>{description}</p>
			</div>
			<div className={s.projectImage}>
				<Image src={projectImage} alt={name} width={300} height={200} />
			</div>
		</div>
	);
};

export default Subsidiary;