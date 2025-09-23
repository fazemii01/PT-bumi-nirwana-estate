import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils";
import { getImageUrl } from "@/service/imageUrl";
import { Property } from "@/types/properties";
import { Badge, Building2, Calendar, Globe, Home, Mail, Phone, User } from "lucide-react";

const SidebarInformation = ({ property }: { property: Property }) => {
  const imgUrl = (path: string) => getImageUrl(path);
  return (
    <div className="space-y-6">
      {/* Developer & Agent Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Developer & Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Developer Section */}
          <div className="flex items-center gap-4">
            <img src={imgUrl(`developer/${property.developer?.logo_url}`)} alt={property.developer?.name || "Developer Logo"} className="w-12 h-12 object-cover rounded-full border" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">{property.developer?.name}</p>
              <a href={property.developer?.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                <Globe className="w-3 h-3" />
                {property.developer?.website_url}
              </a>
            </div>
          </div>

          <Separator />

          {/* Agent Section */}
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <img src={imgUrl(`agent/${property.agent?.avatar_url}`)} alt={property.agent?.full_name || "Agent Avatar"} className="w-14 h-14 object-cover rounded-full border" />

            {/* Agent Info */}
            <div className="flex flex-col justify-center space-y-2 text-sm">
              <p className="font-semibold  flex items-center gap-1">
                <User className="w-4 h-4 " />
                {property.agent?.full_name}
              </p>
              <p className=" flex items-center gap-1">
                <Mail className="w-4 h-4 " />
                {property.agent?.email}
              </p>
              <p className=" flex items-center gap-1">
                <Phone className="w-4 h-4 " />
                {property.agent?.phone_number}
              </p>
            </div>
          </div>
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
            <span className="">{formatDate(property.created_at)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="">Last Updated:</span>
            <span className="">{formatDate(property.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SidebarInformation;
