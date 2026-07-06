import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  updateLocationValues,
  advanceStep,
  goToStep,
  setActiveLocation,
  goToSummary,
} from "@/features/fillFlow/fillFlowSlice";
import {
  selectSelectedLocations,
  selectActiveLocation,
  selectActiveLocationId,
  selectSelectedProduct,
  selectIsAllCompleted,
  selectFlowStatus,
} from "@/features/fillFlow/selectors";
import { STEPS, TOTAL_STEPS } from "@/features/fillFlow/constants";
import { validateStep } from "@/features/fillFlow/validators";
import type {
  LocationValues,
  ValidationError,
} from "@/features/fillFlow/types";
import { Stepper } from "@/components/stepper/stepper";
import { LocationList } from "@/components/locationList/locationList";
import { Button } from "@/components/ui/button";
import { StepContent } from "./fillFlow/stepContent";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export function FillFlowPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const selectedLocations = useAppSelector(selectSelectedLocations);
  const activeLocation = useAppSelector(selectActiveLocation);
  const activeLocationId = useAppSelector(selectActiveLocationId);
  const selectedProduct = useAppSelector(selectSelectedProduct);
  const isAllCompleted = useAppSelector(selectIsAllCompleted);
  const flowStatus = useAppSelector(selectFlowStatus);

  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (selectedLocations.length === 0) {
      navigate("/");
    }
  }, [selectedLocations.length, navigate]);

  useEffect(() => {
    if (flowStatus === "summary") {
      navigate("/summary");
    }
  }, [flowStatus, navigate]);

  if (!activeLocation) {
    return null;
  }

  const currentStep = Math.min(activeLocation.currentStep, TOTAL_STEPS - 1);
  const values = activeLocation.values;

  const getFieldError = (field: keyof LocationValues): string | undefined =>
    errors.find((e) => e.field === field)?.message;

  const handleValuesChange = (partial: Partial<LocationValues>) => {
    if (!activeLocationId) return;
    dispatch(
      updateLocationValues({ locationId: activeLocationId, values: partial }),
    );
    const changedFields = Object.keys(partial) as (keyof LocationValues)[];
    setErrors((prev) => prev.filter((e) => !changedFields.includes(e.field)));
  };

  const handleNext = () => {
    if (!activeLocationId) return;
    const result = validateStep(values, currentStep as 0 | 1 | 2 | 3);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    dispatch(advanceStep(activeLocationId));
  };

  const handleBack = () => {
    if (!activeLocationId) return;
    if (currentStep > 0) {
      dispatch(
        goToStep({ locationId: activeLocationId, stepIndex: currentStep - 1 }),
      );
      setErrors([]);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (!activeLocationId) return;
    dispatch(goToStep({ locationId: activeLocationId, stepIndex }));
    setErrors([]);
  };

  const handleLocationSelect = (id: string) => {
    dispatch(setActiveLocation(id));
    setErrors([]);
  };

  const handleGoToSummary = () => {
    dispatch(goToSummary());
    navigate("/summary");
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-heading)]">
            Dolum Akışı
          </h1>
          {selectedProduct && (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              <span className="font-medium text-[var(--color-text)]">
                {selectedProduct.name}
              </span>{" "}
              - {selectedProduct.sku}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            id="back-to-home-btn"
            variant="secondary"
            size="sm"
            onClick={() => navigate("/")}
            leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
          >
            Ana Ekran
          </Button>
          {isAllCompleted && (
            <Button
              id="go-to-summary-btn"
              variant="success"
              size="md"
              onClick={handleGoToSummary}
              rightIcon={<ArrowRight size={16} aria-hidden="true" />}
            >
              Özete Git
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <aside className="w-64 shrink-0" aria-label="Lokasyon listesi">
          <LocationList
            locations={selectedLocations}
            activeLocationId={activeLocationId}
            onSelectLocation={handleLocationSelect}
          />
        </aside>

        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wide">
                  Aktif Lokasyon
                </p>
                <p className="mt-0.5 text-base font-semibold text-[var(--color-text-heading)]">
                  {activeLocation.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--color-text-muted)]">
                  {selectedLocations.findIndex(
                    (l) => l.id === activeLocationId,
                  ) + 1}{" "}
                  / {selectedLocations.length}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <Stepper
                steps={STEPS}
                currentStep={activeLocation.currentStep}
                onStepClick={handleStepClick}
                locationName={activeLocation.name}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm flex-1 flex flex-col">
            <div className="px-6 py-5 border-b border-[var(--color-border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-600)] flex items-center justify-center text-white text-sm font-bold">
                  {currentStep + 1}
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-text-heading)]">
                    {STEPS[currentStep]?.label}
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {STEPS[currentStep]?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1">
              <StepContent
                step={currentStep as 0 | 1 | 2 | 3}
                values={values}
                onChange={handleValuesChange}
                getError={getFieldError}
              />
            </div>

            <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between bg-[var(--color-neutral-50)] rounded-b-2xl">
              <Button
                id="prev-step-btn"
                variant="secondary"
                size="md"
                onClick={handleBack}
                disabled={currentStep === 0}
                leftIcon={<ArrowLeft size={16} aria-hidden="true" />}
              >
                Geri
              </Button>

              <div className="text-xs text-[var(--color-text-muted)]">
                Adım {currentStep + 1} / {TOTAL_STEPS}
              </div>

              <Button
                id="next-step-btn"
                variant="primary"
                size="md"
                onClick={handleNext}
                rightIcon={
                  isLastStep ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <ArrowRight size={16} aria-hidden="true" />
                  )
                }
              >
                {isLastStep ? "Lokasyonu Tamamla" : "İleri"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
