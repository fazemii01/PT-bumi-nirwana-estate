import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrencyFetching } from '@hooks/index';
import { formatCatalogTranslation } from '@utils/formatters';
import { UNITS } from '@modules/pages/catalogPage/utils/units';
import type { ICatalogTable } from '@t-types/data';

import {
	formatTableAfterPrefix,
	formatTableFullPrice,
	formatToPrefixOnly,
} from '@modules/pages/catalogPage/utils/formatters';

import s from './CatalogPageTable.module.scss';


const CatalogPageTable: FC<{
	tableInfo: ICatalogTable;
	contractType: string;
	realEstateType: string;
	price: number;
	type: string;
	jenis: string;
	luas: string;
	status: string;
	id: string;
	price_unit: string;
	building_size: string;
	total_units: number;
}> = ({ total_units ,building_size, price_unit, tableInfo, realEstateType, contractType, price, type, luas, status, id }) => {
	const { i18n, t: tCommon } = useTranslation('common');
	const { t: tCatalog } = useTranslation('catalog');
	// const {t} = useTranslation('catalog');

	// tableInfo.totalCost = price;
	const table = Object.entries(tableInfo)
		.map(
			([key, value]) =>
				value && {
					key: key,
					value: value,
				},
		)
		.filter(Boolean);

	// const itemContractType = tCommon(formatCatalogTranslation(contractType));
	// const itemRealEstateType = tCommon(formatCatalogTranslation(realEstateType));

	return (
		<div className={s.wrapper}>
			<table className={s.container}>
				<tbody>
					{status && (
						<tr>
							<td>{tCatalog('STATUS')}</td>
							<td>{status}</td>
						</tr>
					)}
					{Number(total_units) > 0 && (
						<tr>
							<td>{tCatalog('TOTAL_UNITS')}</td>
							<td>{total_units}</td>
						</tr>
					)}

					{luas && Number(luas) > 0 && (
						<tr>
							<td>{tCatalog('LUAS')}</td>
							<td>{Math.floor(Number(luas)) + ' ' + UNITS[i18n.language].squareMeters}</td>
						</tr>
					)}

					{building_size && Number(building_size) > 0 && (
						<tr>
							<td>{tCatalog('BUILDING_SIZE')}</td>
							<td>{Math.floor(Number(building_size)) + ' ' + UNITS[i18n.language].squareMeters}</td>
						</tr>
					)}

					{type && (
						<tr>
							<td>{tCatalog('TYPE_OF_RESIDENCE')}</td>
							<td>{type}</td>
						</tr>
					)}

					{price_unit && (
						<tr>
							<td>{tCatalog('PRICE_UNIT')}</td>
							<td>{price_unit}</td>
						</tr>
					)}

					{price > 0 && (
						<tr>
							<td>{tCatalog('PRICE')}</td>
							<td>
								{new Intl.NumberFormat(i18n.language, {
									style: 'currency',
									currency: UNITS[i18n.language].currency,
									minimumFractionDigits: 0,
								}).format(Number(price))}
							</td>
						</tr>
					)}
				</tbody>

				<tbody>
				</tbody>
			</table>
			<table className={s.container}>
				<tbody>
					{table.map((item) => {
						if (item) {
							const isCanBeAnyAmount =
								(item.key === 'offices' ||
									item.key === 'kitchen' ||
									item.key === 'bathrooms') &&
								item.value === 'any';

							const isLandPlot = item.key === 'landPlot';
							const itemKey = item.key.toUpperCase();
							const itemValue = item.value.toString();
							let displayValue = itemValue;

							if (item.key === 'bathrooms' && itemValue !== 'any') {
								displayValue = itemValue.replace(' pcs', '');
							}
							const formatAfterPrefix = formatTableAfterPrefix(
								contractType,
								i18n.language,
								itemKey,
							);

							const isValueWithPrefix = [
								'RENT1M2',
								'OPERATIONAL1M2',
								'TOTALCOST',
							].includes(itemKey);

							return (
								<tr key={item.key}>
									<td>{tCatalog(`TABLE.${itemKey}`)}</td>
									<td>
										{isValueWithPrefix
											? formatTableFullPrice(i18n.language, itemValue)
											: isCanBeAnyAmount
												? tCommon('')
												: isLandPlot
													? formatToPrefixOnly(i18n.language, itemValue)
													: displayValue}{' '}
										<span
											dangerouslySetInnerHTML={{
												__html: item.key === 'kitchen' ? '' : formatAfterPrefix,
											}}
										/>
									</td>
								</tr>
							);
						}
					})}
				</tbody>
			</table>
		</div>

	);
};

export default CatalogPageTable;
