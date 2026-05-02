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
        name: "We build AI products that solve real problems, starting with Sanu.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a conversation" })).toHaveAttribute(
      "href",
      "/en#contact",
    );
  });

  it("renders the investor deck hero in Portuguese", () => {
    render(<PitchDeckPage locale="pt-br" messages={ptBrMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "Construímos produtos de IA que resolvem problemas reais, começando pelo Sanu.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the key deck sections, Sanu, and founders", () => {
    render(<PitchDeckPage locale="en" messages={enMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "AI is still trapped in POCs and superficial layers.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "The advantage is AI engineering shipped to production.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Sanu: a healthcare operations platform already in production.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Clinical RAG and automation")).toBeInTheDocument();
    expect(screen.getByText("Felipe Cavalcante Ogata")).toBeInTheDocument();
    expect(screen.getByText("Roberta Silveira")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sanu in production - trysanu.com" })).toHaveAttribute(
      "href",
      "https://www.trysanu.com",
    );
  });
});
