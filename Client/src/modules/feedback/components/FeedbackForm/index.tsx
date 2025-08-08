import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import cn from 'classnames';

import Button from '@modules/common/components/Button';
import InputField from '@modules/common/components/InputField';
import IconBird from '@icons/components/IconBird';

import { TG_BOT } from '@utils/credentials';

import type { ChangeEvent, FormEvent } from 'react';

import s from './FeedbackForm.module.scss';

const FeedbackForm: FC<{ message?: string; isColumnType?: boolean }> = ({
	message,
	isColumnType = false,
}) => {
	const { t: tCommon } = useTranslation('common');
	const { t: tCatalog } = useTranslation('catalog');
	const { basePath, asPath } = useRouter();
	const WA_NUMBER = '6285852585898';
	const orderWasByLink = `http:localhost:3001${basePath + asPath}`;
	const messageText = message ? `[${message}]` : 'Без повідомлення';
	const initFormData = {
		name: '',
		phone: '',
		message: messageText,
	};
	const [formData, setFormData] = useState(initFormData);
	const [isSuccessfulOrderAlert, setIsSuccessfulOrderAlert] = useState(false);

	const handleSuccessfulOrder = () => {
		setIsSuccessfulOrderAlert(true);

		setTimeout(() => {
			setIsSuccessfulOrderAlert(false);
		}, 5000);
	};

	useEffect(() => {
		if (messageText !== formData.message) {
			setFormData({
				...formData,
				message: tCatalog('HELLO_I_AM_INTERESTED') + ' ' + messageText,
			});
		}
		// eslint-disable-next-line
	}, [messageText, tCatalog]);

	const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const botResponseMessage =
			'Name: ' +
			formData.name +
			'\n' +
			'Phone: ' +
			formData.phone +
			'\n' +
			'Message: ' +
			formData.message +
			'\n' +
			'Order from: ' +
			orderWasByLink;

		for (const chatID of TG_BOT.CHAT_ID_LIST) {
			try {
				// Encode the message to ensure it's a valid URL parameter
				const encodedMessage = encodeURIComponent(botResponseMessage);

				// Construct the WhatsApp URL
				const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;

				// Open the WhatsApp chat in a new tab
				window.open(whatsappUrl, '_blank');

				// Proceed with success actions
				setFormData(initFormData);
				handleSuccessfulOrder();
				console.log('Opening WhatsApp chat with pre-filled message!');
			} catch (error) {
				// This catch block will be less common with window.open but is good for general error handling
				window.alert(tCommon('THE_REQUEST_COULD_NOT_BE_SENT'));
				console.error(error);
			}
		}
	};

	const handleInputChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	return (
		<form
			onSubmit={handleFormSubmit}
			className={cn(s.container, isColumnType && s.column)}
		>




			{message && (
				<textarea
					spellCheck="false"
					name="message"
					value={formData.message}
					onChange={handleInputChange}
				/>
			)}
			<Button
				text={tCommon(isSuccessfulOrderAlert ? 'SENT' : 'SEND_A_REQUEST')}>
				{isSuccessfulOrderAlert && <IconBird />}
			</Button>
		</form>
	);
};

export default FeedbackForm;
