import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { Property } from "@/types/properties";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import React from "react";

const PropertyBuilding = ({ property }: { property: Property }) => {
  return (
    <TabsContent value="buildings">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Buildings</CardTitle>
            <CardDescription>Manage buildings within this property development</CardDescription>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Building
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.map((building) => (
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
                      <span className="text-gray-500">Area:</span>
                      <p className="font-medium">{building.area}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Floors:</span>
                      <p className="font-medium">{building.floors}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Units:</span>
                      <p className="font-medium">{building.units}</p>
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
