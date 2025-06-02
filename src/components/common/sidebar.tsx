"use client";

import { currentUser } from "@/app/actions/actions";
import { AppDispatch, RootState } from "@/store";
import { saveUser } from "@/store/features/userSlice";
import { createClient } from "@/utils/supabase/client";
import {
  BellOutlined,
  BookFilled,
  BuildFilled,
  DashboardFilled,
  FolderFilled,
  LayoutFilled,
  LeftOutlined,
  LogoutOutlined,
  MenuOutlined,
  PlusCircleFilled,
  QuestionCircleOutlined,
  RightOutlined,
  SearchOutlined,
  SettingOutlined,
  SnippetsFilled,
  ToolFilled,
  UserOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type NavItem = {
  icon: string;
  label: string;
  href: string;
  hasSubmenu?: boolean;
  badge?: number;
  index?: number;
  view?: boolean;
};

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [page, setPage] = useState<number>();
  const router = useRouter();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  const pages = [
    { href: "/dashboard", icon: <DashboardFilled />, index: 0, label: "Home" },
    {
      href: "/dashboard/report-tracker",
      icon: <BookFilled />,
      index: 1,
      label: "Report Tracker",
    },
    {
      href: "/dashboard/clients",
      icon: <BuildFilled />,
      index: 2,
      label: "Clients",
    },
    {
      href: "/dashboard/job-postings",
      icon: <FolderFilled />,
      index: 3,
      label: "Job Postings",
      hasSubmenu: true,
    },
    {
      href: "/dashboard/candidates",
      icon: <PlusCircleFilled />,
      index: 4,
      label: "Candidates",
    },
    {
      href: "/dashboard/calendar",
      icon: <SnippetsFilled />,
      index: 5,
      label: "Calendar",
      hasSubmenu: true,
    },
    {
      href: "/dashboard/kanban-boards",
      icon: <LayoutFilled />,
      index: 6,
      label: "Kanban Boards",
    },
    {
      href: "/dashboard/access-control",
      icon: <ToolFilled />,
      index: 7,
      label: "Access Control",
    },
  ];

  const navItems: any[] = pages?.filter((record: any) => record.label);
  const excludedPaths = ["/dashboard/settings", "/error"];

  const logout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const data = [
    {
      label: "My Profile",
      icon: <UserOutlined />,
      handleClick: () => router.push("/settings"),
    },
    {
      label: "My Company",
      icon: <UserSwitchOutlined />,
      handleClick: () => router.push("/settings"),
    },
    {
      label: "Help",
      icon: <QuestionCircleOutlined />,
      handleClick: () => router.push("/dashboard"),
    },
    {
      label: "Logout",
      icon: <LogoutOutlined className="text-red-400" />,
      handleClick: logout,
    },
  ];

  const getUser = async () => {
    setLoading(true);
    const result = await currentUser();
    if (result?.success) {
      dispatch(saveUser(result?.data));
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (excludedPaths.some((path) => pathname.startsWith(path))) {
      return;
    }
    const findPage = navItems?.find(
      (record) => record?.href?.includes(pathname) && record?.view !== false
    );
    setPage(findPage ? findPage.index : 0);
  }, [pathname, router, navItems]);

  const handleSelect = (item: string) => {
    setOpen(false);
    router.push(item);
  };

  const NavContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full">
      <div
        className={`p-4 flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${collapsed && "justify-center"}`}
        >
          <div className="bg-gray-800 p-1 rounded">
            <div className="w-5 h-5 rotate-45 bg-white" />
          </div>
          {!collapsed && (
            <span className="text-lg font-semibold">Job Warp AI</span>
          )}
        </div>
        {!collapsed && (
          <Button
            type="text"
            shape="circle"
            icon={<LeftOutlined className="w-4 h-4 text-gray-500" />}
            onClick={() => setIsCollapsed(true)}
            className="hidden md:flex hover:bg-gray-200"
          />
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1 p-2">
          {navItems?.map((item, index) => (
            <li key={index}>
              {collapsed ? (
                <div className="relative group">
                  <Link
                    href={item.href}
                    onClick={() => setPage(item?.index)}
                    className={`flex items-center justify-center p-3 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                      item?.index === page ? "bg-blue-100 text-blue-600" : ""
                    }`}
                  >
                    <span
                      className={`text-gray-500 relative ${
                        item?.index === page ? "text-blue-600" : ""
                      }`}
                    >
                      {item.icon && (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-4 w-4 flex items-center justify-center rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                  <div className="absolute left-full ml-2 hidden group-hover:block bg-gray-800 text-white text-sm rounded-md px-2 py-1 z-50">
                    {item.label}
                  </div>
                </div>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setPage(item?.index)}
                  className={`flex items-center justify-between p-3 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors ${
                    item?.index === page ? "bg-blue-100 text-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 font-medium">
                    <span
                      className={`text-gray-500 ${
                        item?.index === page ? "text-blue-600" : ""
                      }`}
                    >
                      {item.icon && (
                        <span className="text-lg">{item.icon}</span>
                      )}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {collapsed && (
        <Button
          type="text"
          shape="circle"
          icon={<RightOutlined className="w-4 h-4 text-gray-500" />}
          onClick={() => setIsCollapsed(false)}
          className="hidden md:flex mx-auto mb-4 hover:bg-gray-200"
        />
      )}
    </div>
  );

  const Header = () => (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6">
      <div className="md:hidden">
        <Button
          type="text"
          icon={<MenuOutlined className="w-5 h-5" />}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 hover:bg-gray-100"
        />
        {isMobileOpen && (
          <div className="absolute top-16 left-0 w-64 bg-white border-r shadow-md z-50 md:hidden">
            <NavContent />
          </div>
        )}
      </div>

      <div className="relative max-w-md w-full hidden md:block mx-4">
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined className="text-gray-400" />}
          onFocus={() => setOpen(true)}
          className="pl-8 pr-4 py-2 w-full rounded-md border focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent"
        />
      </div>

      <div className="flex items-center gap-3">
        <div>{/* <h5 className="text-sm">{user?.user?.email}</h5> */}</div>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined className="w-5 h-5 text-gray-600" />}
          className="hover:bg-gray-100"
        />
        <Link href="/dashboard/settings">
          <Button
            type="text"
            shape="circle"
            icon={<SettingOutlined className="w-5 h-5 text-gray-600" />}
            className="hover:bg-gray-100"
          />
        </Link>
        <Dropdown
          menu={{
            items: data.map((item, index) => ({
              key: index,
              label: (
                <div
                  className="flex items-center gap-2"
                  onClick={item.handleClick}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ),
            })),
          }}
          trigger={["click"]}
        >
          <Button
            type="text"
            shape="circle"
            icon={<UserOutlined className="w-5 h-5 text-gray-700" />}
            className="bg-gray-200 hover:bg-gray-300"
          />
        </Dropdown>
      </div>
    </header>
  );

  const SearchDialog = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-4">
        <Input
          placeholder="Type a command or search..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="mb-2"
        />
        <div className="max-h-60 overflow-y-auto">
          {navItems?.length ? (
            <div className="divide-y divide-gray-200">
              <div className="px-2 py-1 text-sm font-semibold text-gray-600">
                Suggestions
              </div>
              {navItems.map((record, index) => (
                <div
                  key={index}
                  className="px-2 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(record?.href)}
                >
                  {record?.label}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-2 py-2 text-gray-500">No results found.</div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return "Loading user please wait...";
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div
        className={`hidden md:flex flex-col h-screen bg-gray-50 border-r shadow-sm transition-all duration-300 z-20 ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <NavContent collapsed={isCollapsed} />
      </div>
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-100">
          {children}
        </main>
      </div>
      <SearchDialog />
    </div>
  );
};

export default Sidebar;
