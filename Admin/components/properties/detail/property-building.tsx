"use client";
import { deleteBuildingProperty } from "@/actions/building_property";
import ConfirmMessage from "@/components/confirm-message";
import { showToastError, showToastSuccess } from "@/components/toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";
import {
  BuildingProperty,
  BuildingStatus,
  Specifications,
} from "@/types/building-properties";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const parseSpecifications = (specData: unknown): Specifications => {
  if (typeof specData !== "string") {
    if (typeof specData === "object" && specData !== null) {
      return specData as Specifications;
    }
    return {} as Specifications;
  }
  try {
    const parsed = JSON.parse(specData);
    const data = Array.isArray(parsed) ? parsed[0] : parsed;
    if (typeof data === "object" && data !== null) {
      return data;
    }
    return {} as Specifications;
  } catch (error) {
    return {} as Specifications;
  }
};

const PropertyBuilding = ({
  buildings,
  nameProperty,
}: {
  buildings: BuildingProperty[];
  nameProperty: string;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await deleteBuildingProperty({ id });
      if (!res.success) {
        showToastError(res.message || "Failed delete data");
        return;
      }
      showToastSuccess("Delete building successful");
      router.refresh();
    } catch (e) {
      showToastError("Unexpected error while deleting");
    } finally {
      setIsLoading(false);
      setOpen(false);
      setSelectedId(null);
    }
  };

  const getStatusColor = (status: BuildingStatus) => {
    switch (status) {
      case BuildingStatus.PRE_LAUNCH:
        return "bg-blue-100 text-blue-800";
      case BuildingStatus.AVAILABLE:
        return "bg-green-100 text-green-800";
      case BuildingStatus.SOLD_OUT:
        return "bg-red-100 text-red-800";
      case BuildingStatus.RESERVED:
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <TabsContent value="buildings">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div className="space-y-1.5">
            <CardTitle>Bangunan Properti {nameProperty}</CardTitle>
            <CardDescription>
              Kelola bangunan dalam pengembangan properti ini
            </CardDescription>
          </div>
          <Link href="/properties/building-properties/create">
            <Button className="cursor-pointer">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Tambah Bangunan</span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buildings.length > 0 ? (
              buildings.map((building) => {
                const specs = parseSpecifications(building.specifications);

                return (
                  <Card
                    key={building.id}
                    className="relative rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-semibold">
                          {building.name}
                        </CardTitle>
                        <Badge
                          className={`${getStatusColor(
                            building.status
                          )} rounded-full px-3 py-1 text-xs font-medium`}
                          variant="secondary"
                        >
                          {building.status}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Luas Bangunan</span>
                          <p className="font-medium">
                            {building.building_size ?? 0} m²
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Tingkat Lantai</span>
                          <p className="font-medium">{specs?.floors ?? "_"}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Units</span>
                          <p className="font-medium">
                            {building.total_units ?? "_"}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Harga</span>
                          <p className="font-medium">
                            {building.price != null
                              ? formatCurrency(building.price)
                              : "_"}
                          </p>
                        </div>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/properties/building-properties/edit/${building.id}`}
                        >
                          <Button
                            variant="outline"
                            size="lg"
                            className="cursor-pointer flex-1 w-full h-9 rounded-lg flex items-center justify-center border bg-gray-200  text-sm font-medium  hover:border-gray-300 transition-colors"
                          >
                            <Edit className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                        </Link>
                        <Link
                          href={`/properties/building-properties/detail/${building.id}`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer flex-1 w-full h-9 rounded-lg flex items-center justify-center border  bg-gray-200 text-sm font-medium  hover:border-gray-300 transition-colors"
                          >
                            <Eye className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          size="sm"
                          className="cursor-pointer flex-1 h-9 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center justify-center"
                          onClick={() => {
                            setSelectedId(building.id);
                            setOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card className="col-span-full text-center py-12 rounded-2xl border border-dashed border-gray-300 shadow-sm">
                <CardContent className="flex flex-col items-center space-y-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7l9 6 9-6M4 21h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Belum ada bangunan
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Tambahkan bangunan baru untuk properti ini
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmMessage
        open={open}
        setOpen={setOpen}
        data={selectedId ?? ""}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
    </TabsContent>
  );
};

export default PropertyBuilding;
