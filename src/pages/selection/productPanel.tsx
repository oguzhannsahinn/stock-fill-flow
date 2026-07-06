import { Search, Package, Check } from "lucide-react";
import { CATEGORIES, categoryStyles } from "@/constants/selectionPage";
import { Input } from "@/components/ui/input";
import type { CategoryFilter } from "@/constants/selectionPage";
import type { Product } from "@/features/fillFlow/types";

interface ProductPanelProps {
  filteredProducts: Product[];
  selectedProductId: string | null;
  selectedProduct: Product | null;
  productSearch: string;
  categoryFilter: CategoryFilter;
  categoryCounts: Record<string, number>;
  onSearchChange: (q: string) => void;
  onCategoryChange: (cat: CategoryFilter) => void;
  onSelectProduct: (id: string) => void;
}

export function ProductPanel({
  filteredProducts,
  selectedProductId,
  selectedProduct,
  productSearch,
  categoryFilter,
  categoryCounts,
  onSearchChange,
  onCategoryChange,
  onSelectProduct,
}: ProductPanelProps) {
  const renderCategoryButton = (cat: CategoryFilter) => {
    const isActive = categoryFilter === cat;
    const style = cat !== "Tümü" ? categoryStyles[cat] : null;
    return (
      <button
        key={cat}
        type="button"
        id={`cat-filter-${cat.replace(/\s+/g, "-")}`}
        aria-pressed={isActive}
        onClick={() => onCategoryChange(cat)}
        className={[
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
          isActive
            ? cat === "Tümü"
              ? "bg-[var(--color-primary-600)] text-white border-[var(--color-primary-600)] shadow-sm"
              : style?.filterActive
            : cat === "Tümü"
              ? "bg-[var(--color-primary-50)]/40 border-[var(--color-primary-100)] text-[var(--color-primary-600)] hover:bg-[var(--color-primary-50)] hover:border-[var(--color-primary-200)]"
              : style?.filter,
        ].join(" ")}
      >
        {cat !== "Tümü" && style && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white opacity-80" : style.dot}`}
          />
        )}
        {cat}
        <span
          className={`tabular-nums ${isActive ? "opacity-70" : "opacity-50"}`}
        >
          {categoryCounts[cat] ?? 0}
        </span>
      </button>
    );
  };

  const renderProductItem = (product: Product) => {
    const isSelected = selectedProductId === product.id;
    const style = categoryStyles[product.category];
    return (
      <li key={product.id}>
        <button
          type="button"
          id={`product-item-${product.id}`}
          aria-pressed={isSelected}
          onClick={() => onSelectProduct(product.id)}
          className={[
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150",
            isSelected
              ? "bg-[var(--color-primary-50)] border border-[var(--color-primary-200)]"
              : "border border-transparent hover:bg-[var(--color-neutral-50)]",
          ].join(" ")}
        >
          <div className="w-4 h-4 shrink-0 flex items-center justify-center">
            {isSelected ? (
              <Check
                size={16}
                strokeWidth={2.5}
                className="text-[var(--color-primary-600)]"
                aria-hidden="true"
              />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-[var(--color-neutral-300)]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium truncate ${isSelected ? "text-[var(--color-primary-800)]" : "text-[var(--color-text-heading)]"}`}
            >
              {product.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              SKU: {product.sku} - {product.unit}
            </p>
          </div>
          {style && (
            <span
              className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-md ${style.badge}`}
            >
              {product.category}
            </span>
          )}
        </button>
      </li>
    );
  };

  return (
    <section
      aria-labelledby="product-section-title"
      className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col"
    >
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-50)] flex items-center justify-center">
            <Package
              size={16}
              className="text-[var(--color-primary-600)]"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2
              id="product-section-title"
              className="text-sm font-semibold text-[var(--color-text-heading)]"
            >
              Ürün Seçimi
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {selectedProduct
                ? `Seçili: ${selectedProduct.name}`
                : "Dolum yapılacak ürünü seçin"}
            </p>
          </div>
        </div>

        <div className="relative mb-3">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-neutral-400)] pointer-events-none">
            <Search size={14} aria-hidden="true" />
          </div>
          <Input
            id="product-search"
            type="search"
            placeholder="Ürün adı veya SKU ara..."
            value={productSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Ürün ara"
            className="h-9 pl-9 pr-4"
          />
        </div>

        <div
          className="flex flex-wrap gap-1.5"
          role="group"
          aria-label="Kategori filtresi"
        >
          {CATEGORIES.map(renderCategoryButton)}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 max-h-80">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-6">
            <p className="text-sm text-[var(--color-text-muted)]">
              Arama sonucu bulunamadı.
            </p>
          </div>
        ) : (
          <ul role="list" className="p-2 space-y-1" aria-label="Ürün listesi">
            {filteredProducts.map(renderProductItem)}
          </ul>
        )}
      </div>

      {selectedProduct && (
        <div className="px-4 py-3 border-t border-[var(--color-border)] bg-[var(--color-primary-50)]">
          <div className="flex items-center gap-2">
            <Check
              size={13}
              strokeWidth={2.5}
              className="text-[var(--color-primary-600)] shrink-0"
              aria-hidden="true"
            />
            <p className="text-xs text-[var(--color-primary-700)]">
              <span className="font-semibold">{selectedProduct.name}</span>
              {" - SKU: "}
              {selectedProduct.sku}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
