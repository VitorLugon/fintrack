import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Página inicial", () => {
  it("apresenta o propósito do FinTrack", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        name: /suas finanças com mais clareza/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/fundação preparada/i)).toBeInTheDocument();
  });
});
