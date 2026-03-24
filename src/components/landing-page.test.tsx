import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LandingPage } from "@/components/landing-page";
import enMessages from "@/i18n/messages/en.json";
import ptBrMessages from "@/i18n/messages/pt-br.json";

vi.mock("next/navigation", () => ({
  usePathname: () => "/en",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LandingPage", () => {
  it("renders the hero title in English", () => {
    render(<LandingPage locale="en" messages={enMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "AI-native products, built for scale and reliability.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the hero title in Portuguese", () => {
    render(<LandingPage locale="pt-br" messages={ptBrMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "Produtos AI-native, desenhados para escala e confiabilidade.",
      }),
    ).toBeInTheDocument();
  });

  it("renders the Projects section", () => {
    render(<LandingPage locale="en" messages={enMessages} />);

    expect(
      screen.getByRole("heading", {
        name: "Projects",
      }),
    ).toBeInTheDocument();
  });

  it("renders all current project cards", () => {
    render(<LandingPage locale="en" messages={enMessages} />);

    expect(screen.getByText("WearingDaily")).toBeInTheDocument();
    expect(screen.getByText("Live-Drills")).toBeInTheDocument();
    expect(screen.getByText("Platform Health.ai")).toBeInTheDocument();
  });

  it("renders the Yoten meaning in both locales", () => {
    const { rerender } = render(<LandingPage locale="en" messages={enMessages} />);

    expect(screen.getByText(/Yōten \(要点\)/)).toBeInTheDocument();

    rerender(<LandingPage locale="pt-br" messages={ptBrMessages} />);

    expect(screen.getByText(/Yōten \(要点\)/)).toBeInTheDocument();
  });

  it("renders the contact form fields", () => {
    render(<LandingPage locale="en" messages={enMessages} />);

    expect(screen.getByLabelText("Your name")).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByLabelText("What are you building?")).toBeInTheDocument();
    expect(screen.getByLabelText("Website")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Send message",
      }),
    ).toBeInTheDocument();
  });
});
