"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { Property } from "@/types/properties";
import { Camera, Info, MapPin, Settings } from "lucide-react";
import { UpdatePropertyZod } from "@/lib/zod";
import { showToastError, showToastSuccess } from "@/components/toast";
import BasicInfoForm from "@/components/properties/create/basic-info-form";
import LocationForm from "@/components/properties/create/location-form";
import SpecificationsForm from "@/components/properties/create/specifications-form";
import EditMediaForm from "@/components/properties/edit/edit-media";
import { submitUpdateProperty } from "@/actions/property";
import { useRouter } from "next/navigation";

type UpdateSubmitHandler = (props: { id: string; data: Property; originalData: Property }) => Promise<boolean | void>;

function safeParseInitial(initialData: Property): Property {
  const parsed: Property = { ...initialData };

  if (typeof parsed.address === "string") {
    try {
      parsed.address = JSON.parse(parsed.address as unknown as string);
    } catch {
      parsed.address = {};
    }
  } else parsed.address = parsed.address ?? {};

  parsed.location = parsed.location ?? { type: "Point", coordinates: [0, 0] };

  parsed.developerId = parsed.developerId ?? parsed.developer?.id ?? "";
  parsed.agentId = parsed.agentId ?? parsed.agent?.id ?? "";

  // queue upload baru selalu kosong saat masuk edit
  parsed.property_images = [];
  parsed.property_site_plans = [];

  parsed.images = parsed.images ?? [];
  parsed.site_plans = parsed.site_plans ?? [];

  return parsed;
}

const PropertyEditForm = ({ initialData, agents, developers }: { initialData: Property; agents: Agent[]; developers: Developer[] }) => {
  const router = useRouter();
  const safeParsed = useMemo(() => safeParseInitial(initialData), [initialData]);

  const [formData, setFormData] = useState<Property>(safeParsed);
  const [originalData, setOriginalData] = useState<Property>(safeParsed);

  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();

  // state khusus tab media (queue & meta sejajar index)
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newSiteFiles, setNewSiteFiles] = useState<File[]>([]);
  const [imagesMeta, setImagesMeta] = useState<Array<{ caption?: string; sort_order?: number }>>(
    formData.images?.map((x, i) => ({
      caption: x.caption,
      sort_order: x.sort_order ?? i,
    })) ?? []
  );
  const [sitePlansMeta, setSitePlansMeta] = useState<Array<{ name?: string; sort_order?: number }>>(
    formData.site_plans?.map((x, i) => ({
      name: x.name,
      sort_order: x.sort_order ?? i,
    })) ?? []
  );

  useEffect(() => {
    setFormData(safeParsed);
    setOriginalData(safeParsed);
    // reset media states saat initialData berubah
    setNewImageFiles([]);
    setNewSiteFiles([]);
    setImagesMeta(
      safeParsed.images?.map((x, i) => ({
        caption: x.caption,
        sort_order: x.sort_order ?? i,
      })) ?? []
    );
    setSitePlansMeta(
      safeParsed.site_plans?.map((x, i) => ({
        name: x.name,
        sort_order: x.sort_order ?? i,
      })) ?? []
    );
  }, [safeParsed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: type === "number" ? (value as unknown as number) : value,
        } as Property)
    );
  };
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as Property));
  };
  const handleSelectChange = (name: keyof Property, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as Property));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    setFormData((prev) => {
      const [lng0, lat0] = prev.location?.coordinates ?? [0, 0];
      const nextCoords = name === "lng" ? [isNaN(numValue) ? lng0 : numValue, lat0] : [lng0, isNaN(numValue) ? lat0 : numValue];
      return {
        ...prev,
        location: {
          type: "Point",
          coordinates: nextCoords as [number, number],
        },
      } as Property;
    });
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          address: { ...(prev.address as any), [name]: value },
        } as Property)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dataForSubmit: Property = {
      ...formData,
      property_images: newImageFiles,
      property_site_plans: newSiteFiles,
      images: imagesMeta as any,
      site_plans: sitePlansMeta as any,
    };

    const result = UpdatePropertyZod.safeParse(dataForSubmit);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (path.includes("location") || path.includes("address") || path.includes("coordinates")) {
        tab = "location";
      } else if (path.includes("images") || path.includes("site_plans") || path.includes("property_")) {
        tab = "media";
      }
      setActiveTab(tab);
      setError({ [path.join(".")]: firstError.message });
      return;
    }
    setError({});

    startTransition(async () => {
      const res = await submitUpdateProperty({
        data: dataForSubmit,
        originalData,
      });

      if (!res.success) {
        showToastError(res.message || "Failed to update property. Please try again.");
      }
      router.push("/properties");
      showToastSuccess("Property updated successfully!");
      setOriginalData(dataForSubmit);
      setNewImageFiles([]);
      setNewSiteFiles([]);
    });
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Properti</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full h-auto">
              <TabsTrigger value="basic" className="flex items-center justify-center py-2 cursor-pointer">
                <Info className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Info Dasar</span>
              </TabsTrigger>
              <TabsTrigger value="location" className="flex items-center justify-center py-2 cursor-pointer">
                <MapPin className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Lokasi</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center justify-center py-2 cursor-pointer">
                <Camera className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic */}
            <BasicInfoForm formData={formData} handleSelectChange={handleSelectChange} handleInputChange={handleInputChange} handleTextAreaChange={handleTextAreaChange} developers={developers} agents={agents} error={error} />

            {/* Location */}
            {activeTab === "location" && <LocationForm formData={formData} handleAddressChange={handleAddressChange} handleLocationChange={handleLocationChange} error={error} />}

            {/* Media */}
            {activeTab === "media" && (
              <EditMediaForm
                originalImages={originalData.images ?? []}
                originalSitePlans={originalData.site_plans ?? []}
                newImageFiles={newImageFiles}
                setNewImageFiles={setNewImageFiles}
                imagesMeta={imagesMeta}
                setImagesMeta={setImagesMeta}
                newSiteFiles={newSiteFiles}
                setNewSiteFiles={setNewSiteFiles}
                sitePlansMeta={sitePlansMeta}
                setSitePlansMeta={setSitePlansMeta}
                error={error}
                // onDeleteOldImage={async (id) => { /* optional: panggil DELETE /properties/property-image/:id */ }}
                // onDeleteOldFloorPlan={async (id) => { /* optional: panggil DELETE /properties/property-floor-plan/:id */ }}
              />
            )}
          </Tabs>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer" disabled={pending}>
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditForm;
