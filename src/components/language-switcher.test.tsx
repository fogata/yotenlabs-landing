import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { LanguageSwitcher } from "@/components/language-switcher";

const push = vi.fn();
let pathname = "/en";

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push,
  }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    push.mockReset();
    pathname = "/en";
    document.cookie = "yoten_locale=; path=/; max-age=0";
    window.location.hash = "";
  });

  it("stores the locale cookie and preserves the current hash", async () => {
    const user = userEvent.setup();

    render(
      <LanguageSwitcher
        locale="en"
        labels={{ en: "EN", "pt-br": "PT-BR" }}
      />,
    );

    window.location.hash = "#projects";

    await user.click(screen.getByRole("button", { name: "PT-BR" }));

    expect(document.cookie).toContain("yoten_locale=pt-br");
    expect(push).toHaveBeenCalledWith("/pt-br#projects");
  });

  it("preserves the current subroute when switching locales", async () => {
    const user = userEvent.setup();
    pathname = "/en/pitch-deck";

    render(
      <LanguageSwitcher
        locale="en"
        labels={{ en: "EN", "pt-br": "PT-BR" }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "PT-BR" }));

    expect(push).toHaveBeenCalledWith("/pt-br/pitch-deck");
  });
});
