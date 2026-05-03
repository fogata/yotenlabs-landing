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
        name: "Sanu",
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
        name: "Sanu",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "O sistema operacional do profissional de saúde autônomo. Sanu centraliza agenda, teleconsulta, pacientes, documentos, comunicação e IA em uma única plataforma simples. Felipe Ogata, Founder, e Roberta Silveira, Co-founder. Construído pela Yoten Labs.",
      ),
    ).toBeInTheDocument();
  });

  it("renders the Sanu pre-seed deck sections, pricing, ask, and founders", () => {
    render(<PitchDeckPage locale="en" messages={enMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "Independent professionals live in operational chaos.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Today operations happen across WhatsApp + calendar + loose documents.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Sanu turns clinical operations into a simple, automated flow.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "SaaS subscription per professional.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Premium (AI): R$199/month.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Strategy: low-friction entry for fast adoption, expansion through AI premium and automation.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Execution metric: functional product with core modules implemented and running in production; integrated billing remains a future implementation.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Sanu replaces 4 to 5 tools with one simple platform.")).toBeInTheDocument();
    expect(screen.getByText("Pre-seed raise of R$500,000.")).toBeInTheDocument();
    expect(screen.getByText("Felipe Ogata — Founder")).toBeInTheDocument();
    expect(screen.getByText("Roberta Silveira — Co-founder")).toBeInTheDocument();
    expect(
      screen.getByText("Product running. Clear pain. Next step: distribution, validation, and scale."),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start a conversation" })).toHaveAttribute(
      "href",
      "/en#contact",
    );
  });
});
