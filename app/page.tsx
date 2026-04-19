import type { Metadata } from "next";
import ExtractTool from "./components/ExtractTool";

export const metadata: Metadata = {
  title: "FetchRecipe — Extract any recipe from any website",
  description:
    "Paste any recipe URL and instantly get just the ingredients and instructions. No ads, no life stories. Free.",
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "FetchRecipe",
            url: "https://fetchrecipe.com",
            description:
              "Paste any recipe URL and instantly get just the ingredients and instructions. No ads, no life stories.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
            },
          }),
        }}
      />

      {/* Hero section */}
      <section
        className="no-print"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "100px 20px 48px",
          textAlign: "center",
        }}
      >
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
          Free recipe extractor
        </p>
        <h1
          className="hero-headline"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "52px",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.025em",
            color: "var(--black)",
            margin: 0,
          }}
        >
          Fetch the recipe.
          <br />
          Skip the fluff.
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
          Paste any recipe URL and instantly get just the ingredients and
          instructions. No ads, no life stories.
        </p>
      </section>

      {/* Extraction tool */}
      <section style={{ paddingBottom: "32px" }}>
        <ExtractTool />
      </section>

      {/* Features section */}
      <section
        id="how-it-works"
        className="no-print"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "80px 20px",
        }}
      >
        {/* Section divider */}
        <div
          style={{
            width: "40px",
            height: "0.5px",
            background: "var(--gray-border)",
            margin: "0 auto 48px",
          }}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "48px",
            textAlign: "center",
          }}
          className="features-grid"
        >
          {[
            {
              title: "Just the recipe",
              desc: "No ads, no life stories, no pop-ups. Just ingredients and instructions.",
            },
            {
              title: "Print ready",
              desc: "Clean recipe cards formatted for your printer. Just the essentials.",
            },
            {
              title: "Any site",
              desc: "AllRecipes, Food Network, Bon Appetit, and hundreds of other recipe blogs.",
            },
          ].map((feature) => (
            <div key={feature.title}>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "18px",
                  fontWeight: 400,
                  color: "var(--black)",
                  margin: "0 0 10px 0",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "14px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "var(--black)",
                  margin: 0,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SEO text */}
      <section
        className="no-print"
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          padding: "0 20px 80px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "var(--black)",
          }}
        >
          FetchRecipe extracts clean, structured recipes from any cooking
          website. It works with AllRecipes, Food Network, Bon Appetit, King
          Arthur Baking, Budget Bytes, BBC Good Food, Simply Recipes, Taste
          of Home, Love and Lemons, RecipeTin Eats, Half Baked Harvest,
          Skinnytaste, and hundreds of other recipe blogs. Every extracted
          recipe includes separated ingredients, step-by-step instructions,
          prep and cook times, and a print-ready layout.
        </p>
      </section>

      {/* Mobile-responsive styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media screen and (max-width: 768px) {
          .hero-headline {
            font-size: 36px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
      `,
        }}
      />
    </>
  );
}
