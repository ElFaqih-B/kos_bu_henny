import Link from "next/link";
import { Menu, ExternalLink, Plus } from "lucide-react";

interface AdminTopbarProps {
  onMenuClick: () => void;
  title?: string;
  description?: string;
}

export default function AdminTopbar({ 
  onMenuClick, 
  title = "Selamat datang kembali, Admin!", 
  description = "Kelola informasi Kos Bu Henny dari satu tempat." 
}: AdminTopbarProps) {
  return (
    <header className="topbar">
      <button 
        className="icon-button menu-button" 
        onClick={onMenuClick} 
        aria-label="Buka sidebar"
      >
        <Menu size={18} />
      </button>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="topbar-actions">
        <Link href="/" target="_blank" className="soft-button">
          <ExternalLink size={18} />
          <span>Lihat Website</span>
        </Link>
        <Link href="/admin/kamar/tambah" className="primary-button">
          <Plus size={18} />
          <span>Tambah Kamar</span>
        </Link>
      </div>
    </header>
  );
}