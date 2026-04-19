import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FetchRecipe — Extract any recipe from any website",
    template: "%s | FetchRecipe",
  },
  description:
    "Paste any recipe URL and instantly get just the ingredients and instructions. No ads, no life stories. Free.",
  openGraph: {
    title: "FetchRecipe — Extract any recipe from any website",
    description:
      "Paste any recipe URL and instantly get just the ingredients and instructions. No ads, no life stories. Free.",
    type: "website",
    siteName: "FetchRecipe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tagesschrift&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        {/* Navigation */}
        <header
          className="no-print"
          style={{ borderBottom: "0.5px solid var(--gray-border)" }}
        >
          <nav
            className="mx-auto flex max-w-[800px] items-center justify-between px-5 py-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <Link
              href="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="FetchRecipe"
                style={{
                  height: "28px",
                  width: "auto",
                }}
              />
            </Link>
            <ul className="flex items-center gap-6">
              {["How it works", "Blog"].map((label) => (
                <li key={label}>
                  <Link
                    href={
                      label === "Blog"
                        ? "/blog"
                        : `/#${label.toLowerCase().replace(/\s+/g, "-")}`
                    }
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      color: "var(--black)",
                      textDecoration: "none",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JKJ4BFGZ4L"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JKJ4BFGZ4L');
          `}
        </Script>

        {/* Page content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer
          className="no-print"
          style={{ borderTop: "0.5px solid var(--gray-border)" }}
        >
          <div className="mx-auto flex max-w-[800px] items-center justify-between px-5 py-5">
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "14px",
                color: "var(--black)",
              }}
            >
              FetchRecipe
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "13px",
                color: "var(--black)",
              }}
            >
              &copy; 2026
            </span>
          </div>
        </footer>
      </body>
    </html>
  );
}
