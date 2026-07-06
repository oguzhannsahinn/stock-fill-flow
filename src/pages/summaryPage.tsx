import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  editLocation,
  resetFlow,
  submitFlow,
  backToFlow,
} from "@/features/fillFlow/fillFlowSlice";
import {
  selectSelectedLocations,
  selectSelectedProduct,
  selectSubmitStatus,
  selectSubmitError,
} from "@/features/fillFlow/selectors";
import { Button } from "@/components/ui/button";

import { ArrowLeft, Check, AlertCircle, Package } from "lucide-react";
import { SuccessState } from "./summary/successState";
import { LocationSummaryCard } from "./summary/locationSummaryCard";

export function SummaryPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedLocations = useAppSelector(selectSelectedLocations);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const submitStatus = useAppSelector(selectSubmitStatus);
  const submitError = useAppSelector(selectSubmitError);

  useEffect(() => {
    if (selectedLocations.length === 0) {
      navigate("/");
    }
  }, [selectedLocations.length, navigate]);

  const handleEdit = (locationId: string, stepIndex: number) => {
    dispatch(editLocation({ locationId, stepIndex }));
    navigate("/fill-flow");
  };

  const handleBack = () => {
    dispatch(backToFlow());
    navigate("/fill-flow");
  };

  const handleSubmit = () => {
    dispatch(submitFlow());
  };

  const handleReset = () => {
    dispatch(resetFlow());
    navigate("/");
  };

  const renderSelectedProduct = () => {
    if (!selectedProduct) return null;

    return (
      <div className="bg-[var(--color-primary-50)] rounded-2xl border border-[var(--color-primary-100)] px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary-600)] flex items-center justify-center shrink-0">
            <Package size={20} stroke="white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-medium text-[var(--color-primary-600)] uppercase tracking-wide">
              Seçili Ürün
            </p>
            <p className="text-base font-semibold text-[var(--color-primary-900)]">
              {selectedProduct.name}
            </p>
            <p className="text-xs text-[var(--color-primary-600)]">
              SKU: {selectedProduct.sku} - Birim: {selectedProduct.unit} -{" "}
              {selectedProduct.category}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-2xl font-bold text-[var(--color-primary-800)]">
              {selectedLocations.length}
            </p>
            <p className="text-xs text-[var(--color-primary-600)]">Lokasyon</p>
          </div>
        </div>
      </div>
    );
  };

  const renderSubmitError = () => {
    if (!submitError) return null;

    return (
      <div
        role="alert"
        className="mb-4 p-4 rounded-xl bg-[var(--color-danger-50)] border border-[var(--color-danger-100)] flex items-start gap-3"
      >
        <AlertCircle
          size={18}
          className="text-[var(--color-danger-600)] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-[var(--color-danger-800)]">
            Gönderim Hatası
          </p>
          <p className="text-sm text-[var(--color-danger-700)] mt-0.5">
            {submitError}
          </p>
        </div>
      </div>
    );
  };

  if (submitStatus === "success") {
    return (
      <SuccessState
        onReset={handleReset}
        locationCount={selectedLocations.length}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
            Özet & Onay
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Girilen bilgileri gözden geçirin ve onaylayın.
          </p>
        </div>
        <Button
          id="back-to-flow-btn"
          variant="secondary"
          size="md"
          onClick={handleBack}
          leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
        >
          Geri Dön
        </Button>
      </div>

      {renderSelectedProduct()}

      <div className="space-y-4">
        {selectedLocations.map((loc, index) => (
          <LocationSummaryCard
            key={loc.id}
            location={loc}
            index={index}
            onEdit={handleEdit}
          />
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm px-6 py-5">
        {renderSubmitError()}

        <div className="flex items-center justify-between">
          <p className="text-sm text-[var(--color-text-muted)]">
            {selectedLocations.length} lokasyon için dolum verisi onaylanacak.
          </p>
          <div className="flex gap-3">
            {submitError && (
              <Button
                id="retry-submit-btn"
                variant="secondary"
                size="md"
                onClick={handleSubmit}
              >
                Tekrar Dene
              </Button>
            )}
            <Button
              id="submit-flow-btn"
              variant="primary"
              size="md"
              loading={submitStatus === "loading"}
              onClick={handleSubmit}
              leftIcon={
                submitStatus !== "loading" ? (
                  <Check size={16} aria-hidden="true" />
                ) : undefined
              }
            >
              {submitStatus === "loading"
                ? "Gönderiliyor..."
                : "Onayla ve Gönder"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
