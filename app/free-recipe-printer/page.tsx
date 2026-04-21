import type { Metadata } from "next";
import ExtractTool from "@/app/components/ExtractTool";

export const metadata: Metadata = {
  title: "Free Recipe Printer — Print Any Recipe Without Ads",
  description:
    "Paste any recipe URL and print a clean, ad-free recipe card. No account, no paywall, no clutter. Free forever.",
  openGraph: {
    title: "Free Recipe Printer — Print Any Recipe Without Ads",
    description:
      "Paste any recipe URL and print a clean, ad-free recipe card. No account, no paywall, no clutter. Free forever.",
  },
};

export default function FreeRecipePrinterPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="no-print"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "100px 20px 48px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "52px",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: "var(--black)",
            margin: 0,
          }}
          className="printer-headline"
        >
          Free Recipe Printer
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "var(--black)",
            maxWidth: "480px",
            margin: "24px auto 0",
          }}
        >
          Paste any recipe URL and print a clean, ad-free recipe card — free,
          no account needed, no paywall. Other tools charge for printing. We
          don&apos;t.
        </p>
      </section>

      {/* Extraction tool */}
      <section style={{ paddingBottom: "32px" }}>
        <ExtractTool
          placeholder="Paste any recipe URL to print..."
          printNote="Free, always. No account needed."
        />
      </section>

      {/* What you get */}
      <section
        className="no-print"
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "0 20px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "0.5px",
            background: "var(--gray-border)",
            margin: "0 auto 40px",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--black)",
            letterSpacing: "0.02em",
            marginBottom: "20px",
          }}
        >
          What you get
        </p>
        {["No ads.", "No life story.", "No paywall. Just the recipe, ready to print."].map(
          (line) => (
            <p
              key={line}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--black)",
                margin: "0 0 8px",
              }}
            >
              {line}
            </p>
          )
        )}
      </section>

      {/* Mobile responsive */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media screen and (max-width: 768px) {
            .printer-headline {
              font-size: 36px !important;
            }
          }
        `,
        }}
      />
    </>
  );
}
