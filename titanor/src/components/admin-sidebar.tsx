import Link from "next/link";
import { CreditCard, FileText, Images, Layers3, LayoutDashboard, PackageCheck, RadioTower, ShoppingBag, Tags, TicketPercent, Truck, Users } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

export function AdminSidebar() {
  const items = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/produtos", label: "Produtos", icon: ShoppingBag },
    { href: "/admin/pedidos", label: "Pedidos", icon: PackageCheck },
    { href: "/admin/categorias", label: "Categorias", icon: Layers3 },
    { href: "/admin/marcas", label: "Marcas", icon: Tags },
    { href: "/admin/cupons", label: "Cupons", icon: TicketPercent },
    { href: "/admin/frete", label: "Frete", icon: Truck },
    { href: "/admin/pagamentos", label: "Pagamentos", icon: CreditCard },
    { href: "/admin/clientes", label: "Clientes", icon: Users },
    { href: "/admin/banners", label: "Banners", icon: Images },
    { href: "/admin/blog", label: "Blog", icon: RadioTower },
    { href: "/admin/paginas", label: "Paginas", icon: FileText },
  ];

  return (
    <aside className="h-fit rounded-lg border border-white/10 bg-[#141414] p-4 lg:sticky lg:top-24">
      <BrandLogo compact className="mb-5" />
      <nav className="grid gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold text-zinc-300 hover:bg-[#e30613]/10 hover:text-white">
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
