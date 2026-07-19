// Root layout. Fonts, tokens, skip link, and shell from design/realdoor-mock.html.

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RealDoor | Your information, confirmed by you",
  description:
    "RealDoor renter-controlled housing readiness profile prototype. Assistive, not adjudicative.",
  openGraph: {
    title: "RealDoor | Your information, confirmed by you",
    description: "A renter-side copilot for affordable housing readiness. It never decides eligibility.",
    images: [{ url: "/images/social-card.png", width: 1200, height: 630, alt: "RealDoor social card" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RealDoor | Your information, confirmed by you",
    description: "A renter-side copilot for affordable housing readiness. It never decides eligibility.",
    images: ["/images/social-card.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,600&family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <a className="skip-link" href="#profile">
          Skip to profile
        </a>
        {children}
        <div id="announcer" className="live-region" aria-live="polite" aria-atomic="true" />
      </body>
    </html>
  );
}
