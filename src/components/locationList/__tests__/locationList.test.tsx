import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocationList } from "../locationList";
import type { Location } from "@/features/fillFlow/types";

const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Ameliyathane – Sarf Malzeme Rafı",
    status: "completed",
    currentStep: 4,
    values: {
      criticalAmount: 10,
      minCapacity: 20,
      maxCapacity: 50,
      fillAmount: 40,
      expiryDate: "2026-08-01",
    },
  },
  {
    id: "loc-2",
    name: "Dahiliye Koğuşu – Hemşire Arabalığı",
    status: "active",
    currentStep: 1,
    values: {
      criticalAmount: 5,
      minCapacity: null,
      maxCapacity: null,
      fillAmount: null,
      expiryDate: null,
    },
  },
  {
    id: "loc-3",
    name: "Yoğun Bakım Ünitesi – Depo B1",
    status: "pending",
    currentStep: 0,
    values: {
      criticalAmount: null,
      minCapacity: null,
      maxCapacity: null,
      fillAmount: null,
      expiryDate: null,
    },
  },
];

describe("LocationList Component", () => {
  it("renders locations and progress correctly", () => {
    render(
      <LocationList
        locations={mockLocations}
        activeLocationId="loc-2"
        onSelectLocation={vi.fn()}
      />,
    );

    expect(screen.getByText("Lokasyonlar")).toBeInTheDocument();
    expect(screen.getByText("1/3 tamamlandı")).toBeInTheDocument();
    expect(screen.getByText("Ameliyathane")).toBeInTheDocument();
    expect(screen.getByText("Sarf Malzeme Rafı")).toBeInTheDocument();
    expect(screen.getByText("Dahiliye Koğuşu")).toBeInTheDocument();
    expect(screen.getByText("Hemşire Arabalığı")).toBeInTheDocument();
    expect(screen.getByText("Yoğun Bakım Ünitesi")).toBeInTheDocument();
    expect(screen.getByText("Depo B1")).toBeInTheDocument();
  });

  it("splits the name by any kind of dash and displays it on separate lines", () => {
    const customLocations: Location[] = [
      {
        id: "loc-dash-1",
        name: "Test Hyphen - Normal",
        status: "active",
        currentStep: 1,
        values: {
          criticalAmount: null,
          minCapacity: null,
          maxCapacity: null,
          fillAmount: null,
          expiryDate: null,
        },
      },
      {
        id: "loc-dash-2",
        name: "Test EnDash – En",
        status: "active",
        currentStep: 1,
        values: {
          criticalAmount: null,
          minCapacity: null,
          maxCapacity: null,
          fillAmount: null,
          expiryDate: null,
        },
      },
      {
        id: "loc-dash-3",
        name: "Test EmDash — Em",
        status: "active",
        currentStep: 1,
        values: {
          criticalAmount: null,
          minCapacity: null,
          maxCapacity: null,
          fillAmount: null,
          expiryDate: null,
        },
      },
    ];

    render(
      <LocationList
        locations={customLocations}
        activeLocationId="loc-dash-1"
        onSelectLocation={vi.fn()}
      />,
    );

    expect(screen.getByText("Test Hyphen")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Test EnDash")).toBeInTheDocument();
    expect(screen.getByText("En")).toBeInTheDocument();
    expect(screen.getByText("Test EmDash")).toBeInTheDocument();
    expect(screen.getByText("Em")).toBeInTheDocument();
  });

  it("calls onSelectLocation only when a clickable location is clicked", () => {
    const handleSelect = vi.fn();
    render(
      <LocationList
        locations={mockLocations}
        activeLocationId="loc-2"
        onSelectLocation={handleSelect}
      />,
    );

    const buttons = screen.getAllByRole("button");

    fireEvent.click(buttons[0]);
    expect(handleSelect).toHaveBeenCalledWith("loc-1");

    fireEvent.click(buttons[1]);
    expect(handleSelect).toHaveBeenCalledWith("loc-2");

    handleSelect.mockClear();

    fireEvent.click(buttons[2]);
    expect(handleSelect).not.toHaveBeenCalled();
    expect(buttons[2]).toBeDisabled();
  });

  it("updates the screen reader live region when active location changes", () => {
    const { rerender } = render(
      <LocationList
        locations={mockLocations}
        activeLocationId="loc-1"
        onSelectLocation={vi.fn()}
      />,
    );

    rerender(
      <LocationList
        locations={mockLocations}
        activeLocationId="loc-2"
        onSelectLocation={vi.fn()}
      />,
    );

    const liveRegion = screen.getByText(
      "Aktif lokasyon: Dahiliye Koğuşu – Hemşire Arabalığı",
    );
    expect(liveRegion).toBeInTheDocument();
  });
});
