import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../input";
import { createRef } from "react";

describe("Input Component", () => {
  it("renders correctly with default type", () => {
    render(<Input placeholder="Type here..." aria-label="test-input" />);
    const input = screen.getByLabelText("test-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Type here...");
  });

  it("handles value change and input events", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} aria-label="test-input" />);
    const input = screen.getByLabelText("test-input");

    fireEvent.change(input, { target: { value: "hello" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" aria-label="test-input" />);
    const input = screen.getByLabelText("test-input");
    expect(input).toHaveClass("custom-class");
  });

  it("applies error styling when error is true", () => {
    render(<Input error aria-label="test-input" />);
    const input = screen.getByLabelText("test-input");
    expect(input).toHaveClass("border-[var(--color-danger-500)]");
  });

  it("forwards ref to the native input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="test-input" />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("INPUT");
  });
});
