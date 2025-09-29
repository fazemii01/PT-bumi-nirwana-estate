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
} from '../../utils/formatters';
import s from './CatalogPageTable.module.scss';


const CatalogPageTable: FC<{
	tableInfo: ICatalogTable;
	contractType: string;
	realEstateType: string;
	price: string;
	type: string;
	jenis: string;
	luas: string;
	status: string;
	id: string;
}> = ({ tableInfo, realEstateType, contractType, price, type, luas, status, id }) => {
	const { i18n, t: tCommon } = useTranslation('common');
	const { t: tCatalog } = useTranslation('catalog');
	// const {t} = useTranslation('catalog');

	tableInfo.totalCost = price;
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
		<table className={s.container}>
			<tbody>
				<tr>
					<td>{tCatalog('STATUS' as string)}</td>
					<td>{status}</td>
				</tr>

				<tr>
					<td>{tCatalog('LUAS')}</td>
					<td>{luas + ' ' + UNITS[i18n.language].squareMeters}</td>
				</tr>

				<tr>
					<td>{tCatalog('TYPE_OF_RESIDENCE')}</td>
					<td>{type}</td>
				</tr>

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
											? tCommon('ANY_AMOUNT')
											: isLandPlot
												? formatToPrefixOnly(i18n.language, itemValue)
												: displayValue}{' '}
									<span
										dangerouslySetInnerHTML={{
											__html: formatAfterPrefix,
										}}
									/>
								</td>
							</tr>
						);
					}
				})}

				<br />
				<br />
				{/* <hr className={s.line}/> */}
				<div className={s.infoHeading}>
					<p>
						{tCatalog('INFORMATION')} <span className={s.id}>{tCatalog('DEVEP')}</span>
					</p>
				</div>
				<tr>														
					<td>{tCatalog('PRICE')}</td>	
					<td>{price}</td>
				</tr>
				<tr>														
					<td>{tCatalog('PRICE')}</td>	
					<td>{price}</td>
				</tr>
			</tbody>
			<br />
			<tbody>
			</tbody>
		</table>
				
	);
};

export default CatalogPageTable;
