import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeComponent } from "./index";

describe("HomeComponent", () => {
  it("renders a button with Testing Agent label", () => {
    render(<HomeComponent />);
    const button = screen.getByRole("button", { name: /testing agent/i });
    expect(button).toBeInTheDocument();
  });
});
