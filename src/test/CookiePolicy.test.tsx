import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import { CookiePolicy } from '../app/pages/CookiePolicy';

describe('CookiePolicy', () => {
  const renderCookiePolicy = () => {
    return render(
      <MemoryRouter>
        <CookiePolicy />
      </MemoryRouter>
    );
  };

  it('renders page header and title', () => {
    renderCookiePolicy();
    expect(screen.getByRole('heading', { level: 1, name: /Cookie Policy/i })).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/i)).toBeInTheDocument();
  });

  it('renders explanation of cookie categories and specific cookies', () => {
    renderCookiePolicy();
    expect(screen.getByText(/What are cookies\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Essential Cookies:/i)).toBeInTheDocument();
    expect(screen.getByText(/Analytics Cookies:/i)).toBeInTheDocument();
    expect(screen.getByText(/cookie-consent/i)).toBeInTheDocument();
  });
});
