"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Property } from "@/types/properties";
import {
  BuildingKprRules,
  BuildingProperty,
} from "@/types/building-properties";
import { Camera, Info, MapPin, Settings } from "lucide-react";
import { updateBuildingPropertyZod } from "@/lib/zod";
import { showToastError, showToastSuccess } from "@/components/toast";
import BasicInfoForm from "@/components/building-properties/create/basic-info-form";
import { submitUpdateBuildingProperty } from "@/actions/building_property";
import { useRouter } from "next/navigation";
import EditMediaForm from "@/components/building-properties/edit/edit-media";
import { set } from "zod";
import SpecificationsForm from "../create/specifications-form";

const BuildingPropertyEditForm = ({
  initialData,
  properties,
}: {
  initialData: BuildingProperty;
  properties: Property[];
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<BuildingProperty>({
    id: initialData.id ?? "",
    propertyId: initialData.property?.id ?? "",
    name: initialData.name ?? "",
    status: initialData.status ?? "",
    price: initialData.price ?? 0,
    price_unit: initialData.price_unit ?? "",
    building_size: initialData.building_size ?? 0,
    total_units: initialData.total_units ?? "",
    land_size: initialData.land_size ?? 0,
    description: initialData.description ?? "",
    specifications:
      typeof initialData.specifications === "string"
        ? JSON.parse(initialData.specifications)
        : initialData.specifications ?? {},
    building_images: initialData.building_images ?? [],
    building_floor_plans: initialData.building_floor_plans ?? [],
    images: initialData.images ?? [],
    floor_plans: initialData.floor_plans ?? [],
    building_kpr_file: initialData.building_kpr_file ?? [],
    building_kpr_rules: initialData.building_kpr_rules ?? [],
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [error, setError] = useState<{ [key: string]: string }>({});
  const [pending, startTransition] = useTransition();
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [imagesMeta, setImagesMeta] = useState<{ caption?: string }[]>([]);
  const [floorPlansMeta, setFloorPlansMeta] = useState<{ name?: string }[]>([]);
  const [newFloorFiles, setNewFloorFiles] = useState<File[]>([]);
  const [newKprFiles, setNewKprFiles] = useState<File[]>([]);
  const [kprMeta, setKprMeta] = useState<BuildingKprRules[]>(
    initialData.building_kpr_rules ?? []
  );

  useEffect(() => {
    setNewImageFiles([]);
    setNewFloorFiles([]);
    setNewKprFiles([]);
    setImagesMeta([]);
    setKprMeta([]);
    setFloorPlansMeta([]);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(
      (prev) =>
        ({
          ...prev,
          [name]: type === "number" ? (value as unknown as number) : value,
        } as BuildingProperty)
    );
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value } as BuildingProperty));
  };

  const handleSelectChange = (name: keyof BuildingProperty, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value } as BuildingProperty));
  };

  const handleSpecificationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: e.target.type === "number" ? Number(value) : value,
      },
    }));
  };

  const handleTextAreaSpecificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...formData,
      building_images: newImageFiles,
      building_floor_plans: newFloorFiles,
      building_kpr_file: newKprFiles,
      building_kpr_rules: kprMeta.map((meta, i) => ({
        file: newKprFiles[i],
        preview: newKprFiles[i]
          ? URL.createObjectURL(newKprFiles[i])
          : meta.file_url,
      })),
      images: imagesMeta.map((meta, i) => ({
        file: newImageFiles[i],
        preview: URL.createObjectURL(newImageFiles[i]),
        caption: meta.caption ?? "",
      })),
      floor_plans: floorPlansMeta.map((meta, i) => ({
        file: newFloorFiles[i],
        preview: newFloorFiles[i].type.startsWith("image/")
          ? URL.createObjectURL(newFloorFiles[i])
          : undefined,
        name: meta.name ?? "",
      })),
    };

    const result = updateBuildingPropertyZod.safeParse(updated);
    if (!result.success) {
      const firstError = result.error.errors[0];
      const path = firstError.path;
      let tab = "basic";
      if (
        path.includes("images") ||
        path.includes("floor_plans") ||
        path.includes("building_kpr_rules")
      ) {
        tab = "media";
      } else if (path.includes("specifications")) {
        tab = "specs";
      }
      setActiveTab(tab);
      setError({ [path.join(".")]: firstError.message });
      return;
    }
    setError({});

    startTransition(async () => {
      const res = await submitUpdateBuildingProperty({
        data: updated,
        originalData: initialData,
      });

      if (!res.success) {
        showToastError(
          res.message || "Failed to update property. Please try again."
        );
      }
      router.push(`/properties/detail/${res.propertyId}?tab=buildings`);
      showToastSuccess("Building updated successfully!");
    });
  };

  return (
    <div className="mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Building Properti</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-4 w-full h-auto">
              <TabsTrigger
                value="basic"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Info className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Info Dasar</span>
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Media</span>
              </TabsTrigger>
              <TabsTrigger
                value="specs"
                className="flex items-center justify-center py-2 cursor-pointer"
              >
                <Settings className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Spesifikasi</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic */}
            <BasicInfoForm
              formData={formData}
              handleSelectChange={handleSelectChange}
              handleInputChange={handleInputChange}
              handleTextAreaChange={handleTextAreaChange}
              property={properties}
              error={error}
            />

            {/* Media */}
            {activeTab === "media" && (
              <EditMediaForm
                originalImages={formData.images ?? []}
                originalFloorPlans={formData.floor_plans ?? []}
                originalKprRules={formData.building_kpr_rules ?? []}
                newImageFiles={newImageFiles}
                setNewImageFiles={setNewImageFiles}
                imagesMeta={imagesMeta}
                setImagesMeta={setImagesMeta}
                newFloorFiles={newFloorFiles}
                setNewFloorFiles={setNewFloorFiles}
                floorPlansMeta={floorPlansMeta}
                setFloorPlansMeta={setFloorPlansMeta}
                newKprFiles={newKprFiles}
                setNewKprFiles={setNewKprFiles}
                error={error}
              />
            )}

            {/* Specification */}
            {activeTab === "specs" && (
              <SpecificationsForm
                formData={formData}
                handleSpecificationChange={handleSpecificationChange}
                handleTextAreaSpecificationChange={
                  handleTextAreaSpecificationChange
                }
                error={error}
              />
            )}
          </Tabs>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              disabled={pending}
            >
              {pending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BuildingPropertyEditForm;
