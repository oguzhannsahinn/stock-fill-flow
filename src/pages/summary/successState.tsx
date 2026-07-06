import { Button } from "@/components/ui/button";
import { RotateCcw, Check } from "lucide-react";

export interface SuccessStateProps {
  onReset: () => void;
  locationCount: number;
}

export function SuccessState({ onReset, locationCount }: SuccessStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-[var(--color-success-50)] border-4 border-[var(--color-success-100)] flex items-center justify-center">
        <Check
          size={36}
          strokeWidth={2.5}
          className="text-[var(--color-success-600)]"
          aria-hidden="true"
        />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-[var(--color-text-heading)]">
          Dolum İşlemi Tamamlandı!
        </h2>
        <p className="mt-2 text-[var(--color-text-muted)]">
          {locationCount} lokasyon için dolum verisi başarıyla gönderildi.
        </p>
      </div>
      <Button
        id="new-flow-btn"
        variant="primary"
        size="lg"
        onClick={onReset}
        leftIcon={<RotateCcw size={18} aria-hidden="true" />}
      >
        Yeni Dolum Başlat
      </Button>
    </div>
  );
}
