import { Address } from "@/types/properties";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumSignificantDigits: 3,
  });
  return formatter.format(amount);
};

export const formatDecimal = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0,
  }).format(val);
};

export function formatAddress(address: string | Address | undefined): string {
  let addressObj: Address | undefined;

  if (!address) return "-";

  if (typeof address === "string") {
    try {
      addressObj = JSON.parse(address) as Address;
    } catch (e) {
      console.error("Gagal parse address:", e);
      return "-";
    }
  } else {
    addressObj = address;
  }

  return [addressObj?.street, addressObj?.village, addressObj?.district, addressObj?.city ?? "Lumajang", addressObj?.province ?? "Jawa Timur", addressObj?.postal_code].filter((part) => part && part.trim() !== "").join(", ");
}

export function formatDate(dateString: string | Date | null | undefined, locale: string = "id-ID", options?: Intl.DateTimeFormatOptions) {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, options);
  } catch (error) {
    console.error("Format Date Error:", error);
    return "";
  }
}
