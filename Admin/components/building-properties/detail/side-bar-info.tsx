import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { BuildingProperty } from "@/types/building-properties";
import {
  Badge,
  Building2,
  Calendar,
  Globe,
  Home,
  Mail,
  Phone,
  User,
} from "lucide-react";

const SideBarInfo = ({ building }: { building: BuildingProperty }) => {
  return (
    <div className="space-y-6">
      {/* Developer & Agent Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Developer Section */}
          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">{building.property?.name}</p>
            </div>
          </div>

          <Separator />
        </CardContent>
      </Card>

      {/* Timestamps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="">Created:</span>
            <span className="">{formatDate(building.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="">Last Updated:</span>
            <span className="">{formatDate(building.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SideBarInfo;
