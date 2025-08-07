import { FC } from 'react';
import Image from 'next/image';

import s from './TeamMember.module.scss';

interface ITeamMemberProps {
	name: string;
	position: string;
	image: string;
}

const TeamMember: FC<ITeamMemberProps> = ({ name, position, image }) => {
	return (
		<div className={s.container}>
			<div className={s.image}>
				<Image src={image} alt={name} width={200} height={200} />
			</div>
			<h4 className={s.name}>{name}</h4>
			<p className={s.position}>{position}</p>
		</div>
	);
};

export default TeamMember;