import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Tag,
  Image as ImageIcon,
  Settings,
  BarChart3,
  LineChart,
  LogOut,
} from "lucide-react";

const adminLinks = [
  { name: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
  { name: "المنتجات", href: "/admin/products", icon: ShoppingBag },
  { name: "الفئات", href: "/admin/categories", icon: Tag },
  { name: "البراندات", href: "/admin/brands", icon: Tag },
  { name: "الطلبات", href: "/admin/orders", icon: BarChart3 },
  { name: "العملاء", href: "/admin/users", icon: Users },
  { name: "البنرات", href: "/admin/banners", icon: ImageIcon },
  { name: "التحليلات", href: "/admin/analytics", icon: LineChart },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black-light border-l border-gold/10 fixed h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <LayoutDashboard className="text-gold" size={20} />
            </div>
            <div>
              <h2 className="font-bold gold-text text-sm">لوحة التحكم</h2>
              <p className="text-[10px] text-gold-muted">Pharma One Admin</p>
            </div>
          </div>

          <nav className="space-y-1">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gold-muted hover:text-gold hover:bg-gold/5 transition-all"
              >
                <link.icon size={18} />
                <span className="text-sm">{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gold/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
            >
              <LogOut size={18} />
              <span className="text-sm">خروج</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 mr-64 p-8">
        {children}
      </main>
    </div>
  );
}
