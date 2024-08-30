import { render } from "@testing-library/react";
import React from "react";
import { ThemeSwitcher } from "../theme-switcher";

describe("ThemeSwitcher", () => {
  it("renders without crashing", () => {
    render(<ThemeSwitcher />);
  });

  it('applies "use client" directive', () => {
    const { container } = render(<ThemeSwitcher />);
    expect(container.firstChild).toHaveAttribute("data-use-client");
  });
});
