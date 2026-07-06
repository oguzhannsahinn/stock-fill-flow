import { Search, MapPin } from "lucide-react";
import type { Location } from "@/features/fillFlow/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface LocationPanelProps {
  filteredLocations: Location[];
  selectedLocationIds: string[];
  locationSearch: string;
  onSearchChange: (q: string) => void;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export function LocationPanel({
  filteredLocations,
  selectedLocationIds,
  locationSearch,
  onSearchChange,
  onToggle,
  onSelectAll,
  onClearAll,
}: LocationPanelProps) {
  const allVisible =
    filteredLocations.length > 0 &&
    filteredLocations.every((l) => selectedLocationIds.includes(l.id));

  return (
    <section
      aria-labelledby="location-section-title"
      className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col relative"
    >
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center">
              <MapPin
                size={16}
                className="text-[var(--color-primary-600)]"
                aria-hidden="true"
              />
            </div>
            <div>
              <h2
                id="location-section-title"
                className="text-sm font-semibold text-[var(--color-text-heading)]"
              >
                Lokasyon Seçimi
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                {selectedLocationIds.length > 0
                  ? `${selectedLocationIds.length} lokasyon seçildi`
                  : "Bir veya birden fazla lokasyon seçin"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {!allVisible && filteredLocations.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onSelectAll}>
                Tümünü seç
              </Button>
            )}
            {selectedLocationIds.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                Temizle
              </Button>
            )}
          </div>
        </div>

        <div className="relative mt-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)] pointer-events-none">
            <Search size={14} aria-hidden="true" />
          </div>
          <Input
            type="search"
            placeholder="Lokasyon ara..."
            value={locationSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Lokasyon ara"
            className="h-9 pl-9 pr-4"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 max-h-90">
        {filteredLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              Arama sonucu bulunamadı.
            </p>
          </div>
        ) : (
          <ul
            role="list"
            className="p-2 space-y-1"
            aria-label="Lokasyon listesi"
          >
            {filteredLocations.map((loc) => {
              const isSelected = selectedLocationIds.includes(loc.id);
              const selIndex = selectedLocationIds.indexOf(loc.id);
              return (
                <li key={loc.id}>
                  <label
                    htmlFor={`loc-checkbox-${loc.id}`}
                    className={[
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150",
                      isSelected
                        ? "bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
                        : "border border-transparent hover:bg-[var(--color-neutral-50)]",
                    ].join(" ")}
                  >
                    <input
                      id={`loc-checkbox-${loc.id}`}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggle(loc.id)}
                      aria-label={loc.name}
                      className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary-600)] accent-[var(--color-primary-600)] cursor-pointer"
                    />
                    <span className="flex-1 text-sm text-[var(--color-text-heading)]">
                      {loc.name}
                    </span>
                    {isSelected && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary-600)] text-white text-xs flex items-center justify-center font-medium">
                        {selIndex + 1}
                      </span>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {selectedLocationIds.length > 0 && (
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-neutral-50)] absolute bottom-0 w-full">
          <p className="text-xs text-[var(--color-text-muted)]">
            Seçili:{" "}
            <span className="font-semibold text-[var(--color-primary-700)]">
              {selectedLocationIds.length} lokasyon
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
