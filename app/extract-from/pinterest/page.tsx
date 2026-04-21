import type { Metadata } from "next";
import Link from "next/link";
import { getRelatedSites } from "@/data/sites";
import ExtractTool from "@/app/components/ExtractTool";

export const metadata: Metadata = {
  title: "Extract Recipes from Pinterest — FetchRecipe",
  description:
    "Paste any Pinterest recipe pin and instantly get just the ingredients and instructions — then print a clean, ad-free recipe card. We find the original recipe and strip out the clutter.",
  openGraph: {
    title: "Extract Recipes from Pinterest — FetchRecipe",
    description:
      "Paste any Pinterest recipe pin and instantly get just the ingredients and instructions — then print a clean, ad-free recipe card. We find the original recipe and strip out the clutter.",
  },
};

export default function ExtractFromPinterestPage() {
  const related = getRelatedSites("pinterest");

  return (
    <>
      {/* Hero */}
      <section
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "80px 20px 40px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "40px",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--black)",
            margin: 0,
          }}
        >
          Extract Recipes from Pinterest
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "var(--black)",
            maxWidth: "520px",
            margin: "20px auto 0",
          }}
        >
          Pinterest saves recipes from all over the web — when you paste a pin,
          we follow it to the original source and extract the recipe from there.
          Once extracted, you can print any Pinterest recipe as a clean,
          ad-free card.
        </p>
      </section>

      {/* Extraction tool */}
      <section style={{ paddingBottom: "32px" }}>
        <ExtractTool
          placeholder="Paste a Pinterest pin URL here..."
          subtitle="Works with any pinterest.com/pin/... link"
          showSourceAttribution
        />
      </section>

      {/* How it works */}
      <section
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "48px 20px 0",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "0.5px",
            background: "var(--gray-border)",
            margin: "0 auto 32px",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--black)",
            letterSpacing: "0.02em",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          How it works
        </p>
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {[
            "Paste your Pinterest pin URL into the box above",
            "We follow the pin to the original recipe page",
            "You get a clean recipe card — ready to cook or print",
          ].map((step, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "var(--black)",
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 400,
                  color: "var(--black)",
                  lineHeight: 1.5,
                }}
              >
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Related sites */}
      <section
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "48px 20px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "0.5px",
            background: "var(--gray-border)",
            margin: "0 auto 32px",
          }}
        />
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--black)",
            letterSpacing: "0.02em",
            marginBottom: "14px",
          }}
        >
          Also works with
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          {related.map((r) => (
            <Link
              key={r.slug}
              href={`/extract-from/${r.slug}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--black)",
                textDecoration: "none",
                border: "0.5px solid var(--gray-border)",
                padding: "6px 14px",
                transition: "border-color 200ms var(--ease-out)",
              }}
            >
              {r.name}
            </Link>
          ))}
        </div>
        <Link
          href="/"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--black)",
            textDecoration: "none",
            marginTop: "20px",
            borderBottom: "0.5px solid var(--gray-border)",
            paddingBottom: "2px",
          }}
        >
          Or try any recipe URL on the homepage
        </Link>
      </section>
    </>
  );
}
