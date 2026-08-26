import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { PrivacyPolicy } from "../app/pages/PrivacyPolicy";

describe("PrivacyPolicy", () => {
  const renderPrivacyPolicy = () => {
    return render(
      <MemoryRouter>
        <PrivacyPolicy />
      </MemoryRouter>
    );
  };

  it("renders privacy policy header and GDPR compliance badge", () => {
    renderPrivacyPolicy();
    expect(screen.getByRole("heading", { level: 1, name: /Privacy Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/GDPR & UK Data Protection Compliant/i)).toBeInTheDocument();
  });

  it("renders data controller information and contact email", () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/Data Controller Information/i)).toBeInTheDocument();
    expect(screen.getAllByText(/info@unlockhertech\.com/i).length).toBeGreaterThan(0);
  });

  it("renders legal bases, user rights under GDPR, and third party disclosures", () => {
    renderPrivacyPolicy();
    expect(screen.getByText(/Legal Bases for Processing/i)).toBeInTheDocument();
    expect(screen.getByText(/Explicit Consent/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /6\. Your Legal Rights/i })).toBeInTheDocument();
    expect(screen.getByText(/Right of Access/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Discord/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/WhatsApp/i).length).toBeGreaterThan(0);
  });
});
