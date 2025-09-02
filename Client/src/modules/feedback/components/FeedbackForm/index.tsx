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
	const WA_NUMBER = '6281959948000';
	const orderWasByLink = `http:localhost:3001${basePath + asPath}`;
	const messageText = message ? `[${message}]` : '';
	const initFormData = {
		name: '',
		phone_number: '',
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

		// 1. Post data to the server
		try {
			const response = await fetch('http://localhost:5000/feedback', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: formData.name,
					phone_number: formData.phone_number,
					message: formData.message,
				}),
			});

			if (!response.ok) {
				// Even if the server post fails, we can still proceed with WhatsApp
				console.error('Failed to submit feedback to server');
			}
		} catch (error) {
			console.error('Error submitting feedback to server:', error);
		}

		// 2. Open WhatsApp link
		const botResponseMessage =
			'Name: ' +
			formData.name +
			'\n' +
			'Phone: ' +
			formData.phone_number +
			'\n' +
			'Message: ' +
			formData.message +
			'\n' +
			'Order from: ' +
			orderWasByLink;

		try {
			const encodedMessage = encodeURIComponent(botResponseMessage);
			const whatsappUrl = `https://wa.me/${WA_NUMBER}?text=${encodedMessage}`;
			window.open(whatsappUrl, '_blank');

			// Reset form and show success message after attempting both actions
			setFormData(initFormData);
			handleSuccessfulOrder();
		} catch (error) {
			window.alert(tCommon('THE_REQUEST_COULD_NOT_BE_SENT'));
			console.error(error);
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




			<InputField label={tCommon('NAME')}>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleInputChange}
					required
				/>
			</InputField>
			<InputField label={tCommon('PHONE_NUMBER')}>
				<input
					type="tel"
					name="phone_number"
					value={formData.phone_number}
					onChange={handleInputChange}
					required
				/>
			</InputField>
			<textarea
				spellCheck="false"
				name="message"
				value={formData.message}
				onChange={handleInputChange}
			/>
			<Button
				text={tCommon(isSuccessfulOrderAlert ? 'SENT' : 'SEND_A_REQUEST')}>
				{isSuccessfulOrderAlert && <IconBird />}
			</Button>
		</form>
	);
};

export default FeedbackForm;
