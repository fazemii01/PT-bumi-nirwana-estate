import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { BuildingProperty, BuildingStatus } from "@/types/building-properties";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React from "react";

const PropertyBuilding = ({ buildings, nameProperty }: { buildings: BuildingProperty[]; nameProperty: string }) => {
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
        <CardHeader className="flex flex-row  justify-between">
          <div>
            <CardTitle>Bangunan Properti {nameProperty}</CardTitle>
            <CardDescription>Kelola bangunan dalam pengembangan properti ini</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Bangunan
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.map((building) => (
              <Card key={building.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{building.name}</CardTitle>
                    <Badge className={getStatusColor(building.status)} variant="secondary">
                      {building.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Luas Bangunan:</span>
                      <p className="font-medium">{building.building_size}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Tingkat Lantai:</span>
                      <p className="font-medium">{building.specifications?.floors ?? "_"}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Units:</span>
                      <p className="font-medium">{building.total_units}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Harga:</span>
                      <p className="font-medium">
                        {building.price} / {building.price_unit}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-3 h-3 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-3 h-3 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PropertyBuilding;
