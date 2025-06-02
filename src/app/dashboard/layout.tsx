import Sidebar from "@/components/common/sidebar";
import { ReactNode } from "react";
interface LayoutProps {
  children: ReactNode;
}

export default async function layout({ children }: LayoutProps) {
  return <Sidebar>{children}</Sidebar>;
}
