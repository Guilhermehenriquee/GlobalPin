import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <section className="py-10">
      <div className="container-shell grid gap-8 lg:grid-cols-[260px_1fr]">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </section>
  );
}
