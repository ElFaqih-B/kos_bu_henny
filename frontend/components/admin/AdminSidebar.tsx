"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, BedDouble, MapPinned, Sparkles, 
  Images, Settings2, LogOut, X 
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Kamar", href: "/admin/kamar", icon: BedDouble },
    { name: "Cabang", href: "/admin/cabang", icon: MapPinned },
    { name: "Fasilitas", href: "/admin/fasilitas", icon: Sparkles },
    { name: "Dokumentasi", href: "/admin/dokumentasi", icon: Images },
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`} id="sidebar">
        <div className="brand">
          <div className="brand-copy">
            <strong>Kos Bu Henny</strong>
            <span>Admin Panel</span>
          </div>
          <button 
            className="icon-button sidebar-close" 
            onClick={onClose} 
            aria-label="Tutup sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-scroll">
          <p className="menu-label">UTAMA</p>
          <nav className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => { if (window.innerWidth <= 820) onClose(); }}
                >
                  <Icon size={17} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <p className="menu-label account-label">PENGATURAN</p>
          <nav className="nav-list">
            <Link 
              href="/admin/pengaturan" 
              className={`nav-item ${pathname.startsWith("/admin/pengaturan") ? "active" : ""}`}
            >
              <Settings2 size={17} />
              <span>Pengaturan Website</span>
            </Link>
          </nav>
        </div>

        <button className="logout-button">
          <LogOut size={17} />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Backdrop untuk mobile */}
      <div 
        className={`sidebar-backdrop ${isOpen ? "show" : ""}`} 
        onClick={onClose}
      />
    </>
  );
}