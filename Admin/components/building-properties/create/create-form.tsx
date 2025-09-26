"use client";
import React, { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/properties";
import { PriceUnit, BuildingProperty, BuildingStatus } from "@/types/building-properties";
import { Camera, Info, MapPin, Settings } from "lucide-react";
import { showToastError, showToastSuccess } from "@/components/toast";
import { BuildingPropertyZod } from "@/lib/zod";
import BasicInfoForm from "@/components/building-properties/create/basic-info-form";
import MediaForm from "./media-form";
import SpecificationsForm from "./specifications-form";

import { submitCreateBuildingProperty } from "@/actions/building_property";

import { useRouter } from "next/navigation";

const BuildingCreateForm = ({ property }: { property: Property[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<BuildingProperty>({
    id: "",
    propertyId: "",
    name: "",
    status: BuildingStatus.AVAILABLE,
    price: 0,
    price_unit: PriceUnit.TOTAL,
    building_size: 0,
    total_units: "",
    land_size: 0,
    description: "",
    specifications: {},
    images: [],
    floor_plans: [],
    building_kpr_file: [],
    building_images: [],
    building_floor_plans: [],
    building_kpr_rules: [],
  });

  const [activeTab, setActiveTab] = useState<string>("basic");
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

  const handleSpecificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: e.target.type === "number" ? Number(value) : value,
      },
    }));
  };

  const handleTextAreaSpecificationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleSingleImageUpload = (file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { file, preview, caption: "" }],
      building_images: [...(prev.building_images || []), file],
    }));
  };

  const handleSingleKPRUpload = (file: File) => {
    const preview = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      building_kpr_rules: [...prev.building_kpr_rules, { file, preview }],
      building_kpr_file: [...(prev.building_kpr_file || []), file],
    }));
  };

  const updateImageCaption = (index: number, caption: string) => {
    setFormData((prev) => {
      const updated = [...prev.images];
      updated[index].caption = caption;
      return { ...prev, images: updated };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      const updatedFiles = (prev.building_images || []).filter((_, i) => i !== index);
      return { ...prev, images: updatedImages, property_images: updatedFiles };
    });
  };

  const handleSingleFloorPlanUpload = (file: File) => {
    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined;
    setFormData((prev) => ({
      ...prev,
      floor_plans: [...prev.floor_plans, { file, preview, name: "" }],
      building_floor_plans: [...(prev.building_floor_plans || []), file],
    }));
  };

  const updateFloorPlanName = (index: number, name: string) => {
    setFormData((prev) => {
      const updated = [...prev.floor_plans];
      updated[index].name = name;
      return { ...prev, floor_plans: updated };
    });
  };

  const removeFloorPlan = (index: number) => {
    setFormData((prev) => {
      const updatedPlans = prev.floor_plans.filter((_, i) => i !== index);
      const updatedFiles = (prev.building_floor_plans || []).filter((_, i) => i !== index);
      return {
        ...prev,
        floor_plans: updatedPlans,
        property_floor_plans: updatedFiles,
      };
    });
  };

  const removeKPRRules = (index: number) => {
    setFormData((prev) => {
      const updatedRules = prev.building_kpr_rules.filter((_, i) => i !== index);
      const updatedFiles = (prev.building_kpr_file || []).filter((_, i) => i !== index);
      return {
        ...prev,
        building_kpr_rules: updatedRules,
        building_kpr_file: updatedFiles,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = BuildingPropertyZod.safeParse(formData);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (path.includes("images") || path.includes("floor_plans") || path.includes("building_kpr_rules")) {
        tab = "media";
      } else if (path.includes("specifications")) {
        tab = "specs";
      }
      setActiveTab(tab);

      setError({
        [path.join(".")]: firstError.message,
      });
      return;
    }
    setError({});

    startTransition(async () => {
      const res = await submitCreateBuildingProperty({
        buildingProperty: formData,
      });

      if (!res.success) {
        showToastError(res.message || "Failed new data building property.");
        return;
      }

      router.push(`/properties/detail/${res.propertyId}?tab=buildings`);
      setTimeout(() => {
        showToastSuccess(res.message || "Property created successfully!");
        router.refresh();
      }, 1000);
    });
  };

  return (
    <div className=" mx-auto  space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create Building Property</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full h-auto">
              <TabsTrigger value="basic" className="flex items-center justify-center py-2 cursor-pointer">
                <Info className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Info Dasar</span>
              </TabsTrigger>
              <TabsTrigger value="media" className="flex items-center justify-center py-2 cursor-pointer">
                <Camera className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger value="specs" className="flex items-center justify-center py-2 cursor-pointer">
                <Settings className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Spesifikasi</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <BasicInfoForm formData={formData} handleSelectChange={handleSelectChange} handleInputChange={handleInputChange} handleTextAreaChange={handleTextAreaChange} property={property} error={error} />

            {/* Media Tab */}
            {activeTab === "media" && (
              <MediaForm
                formData={formData}
                handleSingleImageUpload={handleSingleImageUpload}
                handleSingleFloorPlanUpload={handleSingleFloorPlanUpload}
                handleSingleKPRUpload={handleSingleKPRUpload}
                updateImageCaption={updateImageCaption}
                updateFloorPlanName={updateFloorPlanName}
                removeFloorPlan={removeFloorPlan}
                removeImage={removeImage}
                removeKPRRules={removeKPRRules}
                error={error}
              />
            )}

            {/* Specifications Tab */}
            {activeTab === "specs" && <SpecificationsForm formData={formData} handleSpecificationChange={handleSpecificationChange} handleTextAreaSpecificationChange={handleTextAreaSpecificationChange} error={error} />}
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

export default BuildingCreateForm;
