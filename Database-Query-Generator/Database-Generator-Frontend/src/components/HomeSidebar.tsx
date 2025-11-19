import { NotebookPen, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { NavLink } from "react-router-dom";

const items = [
  {
    title: "New Chat",
    url: "/",
    icon: NotebookPen,
  },
  {
    title: "Search Chat",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];
export function HomeSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="bg-[#1e1e1e] text-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-medium text-white mb-2">
            Query Generator
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-2 text-white hover:text-gray-300"
                    >
                      <item.icon />
                      {item.title}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
