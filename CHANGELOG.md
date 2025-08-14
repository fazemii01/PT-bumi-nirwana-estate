# Changelog: Catalog Data Display Fixes

This document summarizes the changes made to fix the data display issues in the catalog and catalog page.

## 1. Type Definitions (`Client/src/types/data.ts`)

The `ICatalogData` interface was updated to match the API response structure.

**Before:**
```typescript
export interface ICatalogData extends ICatalogStaticData {
	visibility: boolean;
	table: ICatalogTable;
	description: ITransVersion;
	location: ITransVersion;
	address: ITransVersion;
	station: ITransVersion;
}
```

**After:**
```typescript
export interface ICatalogData extends ICatalogStaticData {
	visibility: boolean;
	table: ICatalogTable;
	description: ITransVersion;
	location: ITransVersion;
	address: string;
	specifications: string;
	station: ITransVersion;
}
```
**Reasoning:** The `address` and `specifications` fields are sent as JSON strings from the API. This change ensures they are correctly typed.

## 2. Catalog Card Component (`Client/src/modules/pages/catalog/components/CatalogCard/index.tsx`)

The component was updated to parse the `address` and format the `price`.

**Before:**
```typescript
const fullAddress = useCatalogItemFullAddress(
    realEstateType,
    location,
    address,
);
// ...
<address className={s.address}>{fullAddress}</address>
// ...
{currencyRate &&
    formatToPrefixAndPrice(i18n.language, price, currencyRate)}
```

**After:**
```typescript
const parsedAddress = JSON.parse(address);
const fullAddress = `${parsedAddress.street}, ${parsedAddress.city}`;
// ...
<address className={s.address}>{fullAddress}</address>
// ...
{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(price))}
```
**Reasoning:** This change correctly displays the full address and formats the price as Indonesian Rupiah.

## 3. Catalog Page Information Component (`Client/src/modules/pages/catalogPage/components/CatalogPageInformation/index.tsx`)

The component was updated to handle the `specifications` field.

**Before:**
```typescript
const CatalogPageInformation: FC<{
    //...
    tableInfo: ICatalogTable;
    //...
}> = ({
    //...
    tableInfo,
    //...
}) => {
//...
```

**After:**
```typescript
const CatalogPageInformation: FC<{
    //...
    specifications: string;
    //...
}> = ({
    //...
    specifications,
    //...
}) => {
    const tableInfo = JSON.parse(specifications);
//...
```
**Reasoning:** The component now parses the `specifications` JSON string and passes it to the `CatalogPageTable`.

## 4. Catalog Page Table Component (`Client/src/modules/pages/catalogPage/components/CatalogPageTable/index.tsx`)

The component was updated to display the `kitchen`, `bathrooms`, and `kamar` (bedrooms) details from the `specifications`. The old logic was commented out for future reference.

**Before:**
The component had complex logic to handle various table items.

**After:**
```typescript
{/* {table.map((item) => {
    // ... (old logic commented out)
})} */}
{Object.entries(tableInfo).map(([key, value]) => {
    if (key === 'kitchen' || key === 'bathrooms' || key === 'kamar') {
        return (
            <tr key={key}>
                <td>{tCatalog(`TABLE.${key.toUpperCase()}`)}</td>
                <td>{value as string}</td>
            </tr>
        );
    }
    return null;
})}
```
**Reasoning:** This simplifies the table rendering to show only the required specifications, as requested.

## 5. MapTiler API Key

The MapTiler API key was verified in `Client/src/modules/pages/home/components/MapTiller/MapClient.tsx` and is correctly configured.

## 6. Runtime Error Hotfix

Added defensive checks to prevent runtime errors when `address` or `specifications` fields are missing from the API response.

### `CatalogPageInformation` (`Client/src/modules/pages/catalogPage/components/CatalogPageInformation/index.tsx`)

**Before:**
```typescript
tableInfo={JSON.parse(specifications)}
```

**After:**
```typescript
tableInfo={specifications ? JSON.parse(specifications) : {}}
```
**Reasoning:** This prevents the app from crashing if `specifications` is `undefined`.

### `CatalogCard` (`Client/src/modules/pages/catalog/components/CatalogCard/index.tsx`)

**Before:**
```typescript
const parsedAddress = JSON.parse(address);
const fullAddress = `${parsedAddress.street}, ${parsedAddress.city}`;
```

**After:**
```typescript
const parsedAddress = address ? JSON.parse(address) : {};
const fullAddress = parsedAddress.street && parsedAddress.city ? `${parsedAddress.street}, ${parsedAddress.city}` : '';
```
**Reasoning:** This prevents the app from crashing if `address` is `undefined`.