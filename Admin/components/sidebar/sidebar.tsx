import Link from "next/link";
import Image from "next/image";
import Sideitem from "@/components/sidebar/sideitem";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-20 border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <Link href="/">
            <Image
              src="/logo_1.svg"
              width={128}
              height={49}
              alt="logo"
              priority
            />
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <Sideitem />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
