import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Home,
  Activity,
  ClipboardCheck,
  Pill,
  HelpCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const steps = [
  {
    icon: <Package size={20} aria-hidden="true" />,
    step: "1",
    title: "Ürün Seçin",
    description:
      "Dolum yapılacak ilacı veya tıbbi malzemeyi listeden seçin. Kategoriye göre filtreleyebilir ya da isim/SKU ile arama yapabilirsiniz.",
    color: "var(--color-primary-600)",
    bg: "var(--color-primary-50)",
  },
  {
    icon: <Home size={20} aria-hidden="true" />,
    step: "2",
    title: "Lokasyonları Seçin",
    description:
      "Dolum yapılacak depo raflarını veya lokasyonları işaretleyin. Birden fazla lokasyon seçebilir, arama ile hızlıca filtreleyebilirsiniz.",
    color: "var(--color-primary-600)",
    bg: "var(--color-primary-50)",
  },
  {
    icon: <Activity size={20} aria-hidden="true" />,
    step: "3",
    title: "Dolum Akışını Başlatın",
    description:
      'Seçimlerinizi onayladıktan sonra "Başlat" butonuna tıklayın. Sistem her lokasyon için bağımsız bir dolum adımı oluşturur.',
    color: "var(--color-primary-600)",
    bg: "var(--color-primary-50)",
  },
  {
    icon: <ClipboardCheck size={20} aria-hidden="true" />,
    step: "4",
    title: "Miktar Girin & Tamamlayın",
    description:
      "Her lokasyon için dolum miktarını girin. Adımlar arasında geçiş yapabilir, eksikleri düzeltebilir ve akışı tek tıkla tamamlayabilirsiniz.",
    color: "#059669",
    bg: "#ecfdf5",
  },
];

export function Layout({ children }: LayoutProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-600)] flex items-center justify-center shadow-sm">
                <Pill size={20} stroke="white" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-heading)] leading-tight">
                  StockFill
                </p>
                <p className="text-xs text-[var(--color-text-muted)] leading-tight">
                  Dolum Yönetim Sistemi
                </p>
              </div>
            </Link>

            <Button
              id="how-it-works-btn"
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
              leftIcon={<HelpCircle size={15} aria-hidden="true" />}
              aria-haspopup="dialog"
            >
              Nasıl Çalışır?
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {open && (
        <div
          id="how-it-works-overlay"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[4px] animate-[fadeIn_0.18s_ease]"
        >
          <div
            id="how-it-works-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="hiw-title"
            className="bg-white rounded-[1.25rem] shadow-dialog w-full max-w-[540px] max-h-[90vh] overflow-y-auto animate-[slideUp_0.22s_ease]"
          >
            <div className="px-6 pt-6 pb-5 border-b border-[var(--color-border)] flex items-start justify-between gap-4">
              <div>
                <h2
                  id="hiw-title"
                  className="text-lg font-bold text-[var(--color-text-heading)] mb-1"
                >
                  Nasıl Çalışır?
                </h2>
                <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-normal">
                  StockFill ile stok dolum işlemini 4 basit adımda tamamlayın.
                </p>
              </div>
              <button
                id="hiw-close-btn"
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="shrink-0 w-8 h-8 rounded-lg border border-[var(--color-border)] bg-transparent flex items-center justify-center cursor-pointer text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-neutral-100)]"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-0">
              {steps.map((s, i) => (
                <div key={s.step} className="flex gap-4 items-stretch">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.06)]"
                      style={{
                        background: s.bg,
                        color: s.color,
                      }}
                    >
                      {s.icon}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[var(--color-border)] mt-1 rounded" />
                    )}
                  </div>

                  <div
                    className={`pt-2 ${i < steps.length - 1 ? "pb-4" : "pb-0"}`}
                  >
                    <p className="text-[0.8125rem] text-[var(--color-text-muted)] font-semibold mb-0.5">
                      Adım {s.step}
                    </p>
                    <p className="text-[0.9375rem] font-bold text-[var(--color-text-heading)] mb-1">
                      {s.title}
                    </p>
                    <p className="text-[0.8125rem] text-[var(--color-text-muted)] leading-relaxed">
                      {s.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
