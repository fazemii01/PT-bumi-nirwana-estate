"use server";

import { addImages, addProperty, addSitePlan, deletePropertyById, deletePropertyImagesById, deletePropertySiteById, getPropertyById, updateProperty } from "@/api/property";
import { CreateImageProperty, CreateSitePlanProperty, ImageProperty, Property } from "@/types/properties";

export async function getById({ id }: { id: string }) {
  try {
    const res = await getPropertyById({ id });
    if (res.success) {
      return { success: true, data: res.data };
    } else {
      return { success: false, message: res.error || "Gagal mengambil data property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitCreateProperty({ property }: { property: Property }) {
  try {
    const res = await addProperty({ property });
    if (res.success) {
      return { success: true, message: "Property berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitCreateImages({ images, propertyId }: { images: CreateImageProperty; propertyId: string }) {
  try {
    const res = await addImages({ images, propertyId });
    if (res.success) {
      return { success: true, message: "Gambar berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan gambar." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitCreateSitePlan({ site, propertyId }: { site: CreateSitePlanProperty; propertyId: string }) {
  try {
    const res = await addSitePlan({ site, propertyId });
    if (res.success) {
      return { success: true, message: "Site Plan berhasil ditambahkan!" };
    } else {
      return { success: false, message: res.error || "Gagal menambahkan site plan." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function submitUpdateProperty({ data, originalData }: { data: Property; originalData: Property }) {
  try {
    const res = await updateProperty({ data, originalData });

    if (res.success) {
      return { success: true, message: "Property berhasil diupdate!" };
    } else {
      return { success: false, message: res.error || "Gagal update property" };
    }
  } catch (err) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deleteProperty({ id }: { id: string }) {
  try {
    const res = await deletePropertyById(id);
    if (res.success) {
      return { success: true, message: "Property berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus property." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deletePropertyImages({ id }: { id: string }) {
  try {
    const res = await deletePropertyImagesById(id);
    if (res.success) {
      return { success: true, message: "Gambar berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus gambar." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}

export async function deletePropertySitePlan({ id }: { id: string }) {
  try {
    const res = await deletePropertySiteById(id);
    if (res.success) {
      return { success: true, message: "Site plan berhasil dihapus!" };
    } else {
      return { success: false, message: res.error || "Gagal menghapus site plan." };
    }
  } catch (error) {
    return { success: false, message: "Terjadi error pada server." };
  }
}
