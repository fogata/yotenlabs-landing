import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PitchDeckPage } from "@/components/pitch-deck-page";
import enMessages from "@/i18n/messages/en.json";
import ptBrMessages from "@/i18n/messages/pt-br.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/pitch-deck",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("PitchDeckPage", () => {
  it("renders the investor deck hero in English", () => {
    render(<PitchDeckPage locale="en" messages={enMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "Yoten Labs builds AI-native products where intelligence is the operating core.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the investor deck hero in Portuguese", () => {
    render(<PitchDeckPage locale="pt-br" messages={ptBrMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "A Yoten Labs constrói produtos AI-native onde a inteligência é o núcleo operacional.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the key deck sections and portfolio products", () => {
    render(<PitchDeckPage locale="en" messages={enMessages} />);

    expect(screen.getByRole("heading", { name: "AI features are not enough." })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The next wave of software will be built around AI as infrastructure.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "A studio model with paths to owned assets.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("WearingDaily")).toBeInTheDocument();
    expect(screen.getByText("Live-Drills")).toBeInTheDocument();
    expect(screen.getByText("Platform Health.ai")).toBeInTheDocument();
  });
});
