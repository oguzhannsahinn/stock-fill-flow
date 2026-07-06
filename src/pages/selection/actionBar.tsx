import { Info, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/features/fillFlow/types";

export interface ActionBarProps {
  canStart: boolean;
  selectedProduct: Product | null;
  selectedLocationCount: number;
  selectedProductId: string | null;
  onStart: () => void;
}

export function ActionBar({
  canStart,
  selectedProduct,
  selectedLocationCount,
  selectedProductId,
  onStart,
}: ActionBarProps) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl border border-[var(--color-border)] shadow-sm px-6 py-4">
      <div>
        {!canStart && (
          <p
            className="text-sm text-[var(--color-text-muted)] flex items-center gap-1.5"
            role="status"
          >
            <Info size={14} aria-hidden="true" className="shrink-0" />
            {!selectedProductId && selectedLocationCount === 0
              ? "Devam etmek için bir ürün ve en az bir lokasyon seçin."
              : !selectedProductId
                ? "Devam etmek için bir ürün seçin."
                : "Devam etmek için en az bir lokasyon seçin."}
          </p>
        )}
        {canStart && (
          <p className="text-sm text-[var(--color-text-muted)]" role="status">
            <span className="font-medium text-[var(--color-success-700)]">
              Hazır:{" "}
            </span>
            {selectedProduct?.name} için {selectedLocationCount} lokasyon
            seçildi.
          </p>
        )}
      </div>
      <Button
        id="start-flow-btn"
        variant="primary"
        size="lg"
        disabled={!canStart}
        onClick={onStart}
        rightIcon={<ArrowRight size={18} aria-hidden="true" />}
      >
        Dolum Akışını Başlat
      </Button>
    </div>
  );
}
