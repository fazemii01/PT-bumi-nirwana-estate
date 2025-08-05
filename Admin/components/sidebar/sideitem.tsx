"use client";
import React from "react";
import { IoClose, IoMenu } from "react-icons/io5";
import { useState } from "react";
import Link from "next/link";
import {
  Home,
  User,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Calendar,
  Search,
  Bell,
  LogOut,
} from "lucide-react";

const Sideitem = () => {
  const [Open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Documents", icon: FileText, href: "/documents" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Messages", icon: MessageSquare, href: "/messages" },
    { name: "Calendar", icon: Calendar, href: "/calendar" },
    { name: "Search", icon: Search, href: "/search" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
  ];

  const bottomMenuItems = [
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Logout", icon: LogOut, href: "/logout" },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="inline-flex items-center p-2 justify-center text-sm text-gray-500 rounded-md md:hidden hover:bg-gray-100"
        onClick={() => setOpen(!Open)}
      >
        {Open ? <IoClose size={24} /> : <IoMenu size={24} />}
      </button>

      {/* Desktop Sidebar Menu */}
      <div className="hidden md:flex flex-col h-full">
        {/* Main Menu Items */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 group"
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Menu Items */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-4 mt-4">
          <ul className="space-y-2">
            {bottomMenuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 group"
                  >
                    <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {Open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setOpen(false)}
          ></div>

          {/* Mobile Sidebar */}
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-50 md:hidden">
            <div className="flex flex-col h-full">
              {/* Close Button */}
              <div className="flex items-center justify-end p-4 border-b border-gray-200">
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Main Menu Items */}
              <nav className="flex-1 px-4 py-4">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 group"
                          onClick={() => setOpen(false)}
                        >
                          <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Bottom Menu Items */}
              <div className="px-4 pb-4 border-t border-gray-200 pt-4">
                <ul className="space-y-2">
                  {bottomMenuItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200 group"
                          onClick={() => setOpen(false)}
                        >
                          <IconComponent className="w-5 h-5 mr-3 text-gray-500 group-hover:text-blue-600" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Sideitem;
