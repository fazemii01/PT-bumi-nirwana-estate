# Plan to Fix Catalog Data Display

This document outlines the necessary changes to fix the data display issues in the catalog and catalog page. The primary problem is a mismatch between the data structure provided by the API and what the frontend components expect.

## 1. Update Type Definitions

The `ICatalogData` interface in `Client/src/types/data.ts` needs to be updated to accurately reflect the API response. The `address` and `specifications` fields are currently typed as `ITransVersion`, but they are actually JSON strings.

### Before (`Client/src/types/data.ts`)
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

### After (`Client/src/types/data.ts`)
```typescript
export interface ICatalogData extends ICatalogStaticData {
	visibility: boolean;
	table: ICatalogTable;
	description: ITransVersion;
	location: ITransVersion;
	address: string; // Changed from ITransVersion
	specifications: string; // Added
	station: ITransVersion;
}
```
**Explanation:** The `address` and `specifications` fields will be correctly typed as strings, so they can be parsed from JSON.

## 2. Modify `CatalogCard` Component

The `CatalogCard` component needs to parse the `address` JSON string and format the price correctly.

### Before (`Client/src/modules/pages/catalog/components/CatalogCard/index.tsx`)
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

### After (`Client/src/modules/pages/catalog/components/CatalogCard/index.tsx`)
```typescript
const parsedAddress = JSON.parse(address);
const fullAddress = `${parsedAddress.street}, ${parsedAddress.city}`;
const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(price));

// ...
<address className={s.address}>{fullAddress}</address>
// ...
<li>
    {formattedPrice}
</li>
```
**Explanation:** The `address` will be parsed from a JSON string to display the full address. The `price` will be formatted as Indonesian Rupiah.

## 3. Update `CatalogPageInformation` and `CatalogPageTable`

These components need to handle the new `specifications` field and pass it down to the table.

### `CatalogPageInformation` (`Client/src/modules/pages/catalogPage/components/CatalogPageInformation/index.tsx`)

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
    return (
        //...
        <CatalogPageTable
            //...
            tableInfo={tableInfo}
        />
        //...
    )
}
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
    return (
        //...
        <CatalogPageTable
            //...
            tableInfo={tableInfo}
        />
        //...
    )
}
```
**Explanation:** The `specifications` string will be parsed and passed to `CatalogPageTable`.

### `CatalogPageTable` (`Client/src/modules/pages/catalogPage/components/CatalogPageTable/index.tsx`)

The `CatalogPageTable` component will now receive the parsed `tableInfo` object and can render the specifications dynamically.

**Before:**
The component expected `tableInfo` to be an object with a rigid structure.

**After:**
The component will iterate over the keys and values of the `tableInfo` object (which comes from the parsed `specifications`) and display them.

```typescript
{Object.entries(tableInfo).map(([key, value]) => (
    <tr key={key}>
        <td>{tCatalog(`TABLE.${key.toUpperCase()}`)}</td>
        <td>{value}</td>
    </tr>
))}
```
**Explanation:** This change will allow the table to display any specifications provided in the `specifications` JSON string.

## 4. Google Maps API Key

The error message "Google Maps Platform rejected your request. The provided API key is invalid" indicates that the API key used for the map is incorrect or missing. This needs to be configured correctly in the environment variables for the `Client` application. I will add a placeholder for the key in the component.

### `CatalogPageMap` (`Client/src/modules/pages/catalogPage/components/CatalogPageMap/index.tsx`)

I will need to investigate this file to find where the API key is being used and advise on how to fix it. I will read this file next.