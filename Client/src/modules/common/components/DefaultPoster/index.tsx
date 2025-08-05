import { FC } from 'react';
import cn from 'classnames';

import IconGrayLogo from '@icons/components/IconGrayLogo';

import s from './DefaultPoster.module.scss';

const DefaultPoster: FC<{ className?: string }> = ({ className }) => {
	return (
		<div className={cn(s.container, className)}>
			<img src="/assets/logo 2.png" alt="Default Poster" 
				style={{ width: '100px', height: 'auto' }}
			/>
		</div>
	);
};

export default DefaultPoster;
