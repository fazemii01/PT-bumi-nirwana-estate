import { DataTable } from "@/components/properties/data-table";
import { AppSidebar } from "@/components/app-sidebar";
import { getProperty } from "@/api/property";
import { columns } from "@/components/properties/colomns";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Properties = async () => {
  const data = await getProperty();
  return (
    <div className="px-4 py-4">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Properties;
