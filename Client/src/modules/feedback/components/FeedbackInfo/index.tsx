import { FC } from 'react';

import BlockTitle from '@modules/common/components/BlockTitle';

import s from './FeedbackInfo.module.scss';

type TFeedbackInfoProps = {
	title: string;
	desc: string;
};

const FeedbackInfo: FC<TFeedbackInfoProps> = ({ title, desc }) => {
	return (
		<div className={s.container}>
			<BlockTitle title={title} />
			<p className={s.desc}>{desc}</p>
		</div>
	);
};

export default FeedbackInfo;