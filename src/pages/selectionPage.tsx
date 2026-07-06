import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  loadProducts,
  loadLocations,
  selectProduct,
  selectLocations,
  startFlow,
} from "@/features/fillFlow/fillFlowSlice";
import {
  selectProducts,
  selectAllLocations,
  selectSelectedProductId,
  selectSelectedLocationIds,
  selectLoadingProducts,
  selectLoadingLocations,
} from "@/features/fillFlow/selectors";
import type { CategoryFilter } from "@/constants/selectionPage";
import { LoadingState } from "./selection/loadingState";
import { ProductPanel } from "./selection/productPanel";
import { LocationPanel } from "./selection/locationPanel";
import { ActionBar } from "./selection/actionBar";

export function SelectionPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const products = useAppSelector(selectProducts);
  const allLocations = useAppSelector(selectAllLocations);
  const selectedProductId = useAppSelector(selectSelectedProductId);
  const selectedLocationIds = useAppSelector(selectSelectedLocationIds);
  const loadingProducts = useAppSelector(selectLoadingProducts);
  const loadingLocations = useAppSelector(selectLoadingLocations);

  const [locationSearch, setLocationSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("Tümü");

  useEffect(() => {
    if (products.length === 0) dispatch(loadProducts());
    if (allLocations.length === 0) dispatch(loadLocations());
  }, [dispatch, products.length, allLocations.length]);

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) ?? null;

  const filteredProducts = useMemo(() => {
    let list = products;
    if (categoryFilter !== "Tümü") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    const q = productSearch.toLowerCase().trim();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      );
    }
    return list;
  }, [products, categoryFilter, productSearch]);

  const filteredLocations = useMemo(() => {
    const q = locationSearch.toLowerCase().trim();
    if (!q) return allLocations;
    return allLocations.filter((l) => l.name.toLowerCase().includes(q));
  }, [allLocations, locationSearch]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Tümü: products.length };
    for (const p of products) {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    }
    return counts;
  }, [products]);

  const toggleLocation = (id: string) => {
    const newIds = selectedLocationIds.includes(id)
      ? selectedLocationIds.filter((x) => x !== id)
      : [...selectedLocationIds, id];
    dispatch(selectLocations(newIds));
  };

  const handleStart = () => {
    dispatch(startFlow());
    navigate("/fill-flow");
  };

  const canStart = !!selectedProductId && selectedLocationIds.length > 0;
  const isLoading = loadingProducts || loadingLocations;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
          Ürün Bazlı Dolum
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Dolum yapılacak ürünü ve lokasyonları seçin, ardından dolum akışını
          başlatın.
        </p>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ProductPanel
            filteredProducts={filteredProducts}
            selectedProductId={selectedProductId}
            selectedProduct={selectedProduct}
            productSearch={productSearch}
            categoryFilter={categoryFilter}
            categoryCounts={categoryCounts}
            onSearchChange={setProductSearch}
            onCategoryChange={setCategoryFilter}
            onSelectProduct={(id) => dispatch(selectProduct(id))}
          />
          <LocationPanel
            filteredLocations={filteredLocations}
            selectedLocationIds={selectedLocationIds}
            locationSearch={locationSearch}
            onSearchChange={setLocationSearch}
            onToggle={toggleLocation}
            onSelectAll={() =>
              dispatch(selectLocations(filteredLocations.map((l) => l.id)))
            }
            onClearAll={() => dispatch(selectLocations([]))}
          />
        </div>
      )}

      {!isLoading && (
        <ActionBar
          canStart={canStart}
          selectedProduct={selectedProduct}
          selectedLocationCount={selectedLocationIds.length}
          selectedProductId={selectedProductId}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
