"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Agent } from "@/types/agent";
import { Developer } from "@/types/developer";
import { Property, PropertyType } from "@/types/properties";

import { Camera, Info, MapPin, Settings } from "lucide-react";
import { PropertyZod } from "@/lib/zod";
import { showToastError, showToastSuccess } from "@/components/toast";
import BasicInfoForm from "@/components/properties/create/basic-info-form";
import LocationForm from "@/components/properties/create/location-form";
import MediaForm from "@/components/properties/create/media-form";

import { submitCreateProperty } from "@/actions/property";

import { useRouter } from "next/navigation";

const PropertyCreateForm = ({ agents, developers }: { agents: Agent[]; developers: Developer[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<Property>({
    id: "",
    developerId: "",
    agentId: "",
    name: "",
    type: PropertyType.SUBSIDI,
    description: "",
    detail_description: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    address: {},
    property_images: [],
    property_site_plans: [],
    images: [],
    site_plans: [],
  });

  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    console.log(numValue);

    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        type: "Point",
        coordinates: name === "lng" ? [numValue, prev.location!.coordinates[1]] : [prev.location!.coordinates[0], numValue],
      },
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Tambah gambar property
  const handleSingleImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file, preview, caption: "" }],
      property_images: [...(prev.property_images || []), file],
    }));
  };

  // Update caption gambar
  const updateImageCaption = (index: number, caption: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index].caption = caption;
      return { ...prev, images: updated };
    });
  };

  // Hapus gambar
  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      const updatedFiles = (prev.property_images || []).filter((_, i) => i !== index);
      return { ...prev, images: updatedImages, property_images: updatedFiles };
    });
  };

  // Tambah site plan
  const handleSingleFloorPlanUpload = (file: File) => {
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setFormData((prev) => ({
      ...prev,
      site_plans: [...prev.site_plans, { file, preview, name: "" }],
      property_site_plans: [...(prev.property_site_plans || []), file],
    }));
  };

  // Update nama site plan
  const updateFloorPlanName = (index: number, name: string) => {
    setFormData((prev) => {
      const updated = [...prev.site_plans];
      updated[index].name = name;
      return { ...prev, site_plans: updated };
    });
  };

  // Hapus floor plan
  const removeFloorPlan = (index: number) => {
    setFormData((prev) => {
      const updatedPlans = prev.site_plans.filter((_, i) => i !== index);
      const updatedFiles = (prev.property_site_plans || []).filter((_, i) => i !== index);
      return {
        ...prev,
        site_plans: updatedPlans,
        property_site_plans: updatedFiles,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = PropertyZod.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (path.includes("location")) {
        tab = "location";
      } else if (path.includes("images") || path.includes("site_plans")) {
        tab = "media";
      }
      setActiveTab(tab);

      setError({
        [path.join(".")]: firstError.message,
      });
      return;
    }
    setError({});

    startTransition(async () => {
      const res = await submitCreateProperty({ property: formData });

      if (!res.success) {
        showToastError(res.message || "Failed new data property");
      }

      router.push("/properties");
      setTimeout(() => {
        showToastSuccess(res.message || "Property created successfully!");
        router.refresh();
      }, 1000);
    });
  };

  return (
    <div className=" mx-auto  space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Property</h1>
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

            {/* Basic Information Tab */}
            <BasicInfoForm formData={formData} handleSelectChange={handleSelectChange} handleInputChange={handleInputChange} handleTextAreaChange={handleTextAreaChange} developers={developers} agents={agents} error={error} />

            {/* Location Tab */}
            {activeTab === "location" && <LocationForm formData={formData} handleAddressChange={handleAddressChange} handleLocationChange={handleLocationChange} error={error} />}

            {/* Media Tab */}
            {activeTab === "media" && (
              <MediaForm
                formData={formData}
                handleSingleImageUpload={handleSingleImageUpload}
                handleSingleFloorPlanUpload={handleSingleFloorPlanUpload}
                updateImageCaption={updateImageCaption}
                updateFloorPlanName={updateFloorPlanName}
                removeFloorPlan={removeFloorPlan}
                removeImage={removeImage}
                error={error}
              />
            )}
          </Tabs>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
              {pending ? "Loading..." : "Publish Property"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyCreateForm;
