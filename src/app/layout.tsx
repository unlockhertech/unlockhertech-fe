import type { Metadata } from "next";
import StyledComponentsRegistry from "../../public/lib/registry";
import { ThemeProvider } from "@/UI/Global/ThemeProvider";
import "@/UI/Global/fonts";

export const metadata: Metadata = {
  title: "Unlock Her Tech",
  description:
    "Your utopian 90s digital space filled with atomic purple flavour and Ventura highway feeling for all the tech queens.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
