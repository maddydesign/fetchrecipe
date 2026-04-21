import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sites, getSiteBySlug, getRelatedSites } from "@/data/sites";
import ExtractTool from "@/app/components/ExtractTool";

export const dynamicParams = false;

export function generateStaticParams() {
  return sites.map((site) => ({ site: site.slug }));
}

type Props = {
  params: Promise<{ site: string }>;
};

const metaDescriptions: Record<string, string> = {
  "food-network":
    "Extract clean recipes from Food Network. Paste a URL and get the ingredients and steps without the clutter.",
  "bon-appetit":
    "Get just the recipe from Bon Appetit. Paste any URL and instantly extract ingredients and instructions. No ads.",
  "king-arthur-baking":
    "Extract baking recipes from King Arthur. Paste a URL to get precise ingredients and step-by-step instructions.",
  skinnytaste:
    "Grab any Skinnytaste recipe without the ads and pop-ups. Paste a URL, get clean ingredients and instructions.",
  "half-baked-harvest":
    "Extract recipes from Half Baked Harvest instantly. Paste a link and get just the ingredients and method. Free.",
  "recipetin-eats":
    "Pull any RecipeTin Eats recipe into a clean format. Paste the URL and get ingredients and instructions right away.",
  "taste-of-home":
    "Extract recipes from Taste of Home without the clutter. Paste a URL and get a clean list of ingredients and steps.",
  "bbc-good-food":
    "Get clean recipes from BBC Good Food. Paste any URL to extract the ingredients and method without distractions.",
  "budget-bytes":
    "Extract Budget Bytes recipes instantly. Paste a URL and get just the ingredients and instructions, nothing else.",
  "love-and-lemons":
    "Pull recipes from Love and Lemons without the scroll. Paste a URL, get the ingredients and instructions immediately.",
  "once-upon-a-chef":
    "Extract any Once Upon a Chef recipe. Paste the URL and get clean ingredients and step-by-step instructions. Free.",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { site: slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) return {};

  const description =
    metaDescriptions[slug] ??
    `Paste any ${site.name} URL and instantly get just the ingredients and instructions. No ads, no life stories.`;

  return {
    title: `Extract Recipes from ${site.name}`,
    description,
    openGraph: {
      title: `Extract Recipes from ${site.name} — FetchRecipe`,
      description,
    },
  };
}

export default async function ExtractFromSitePage({ params }: Props) {
  const { site: slug } = await params;
  const site = getSiteBySlug(slug);
  if (!site) notFound();

  const related = getRelatedSites(slug);

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
          Extract recipes from {site.name}
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
          {site.description} FetchRecipe makes it easy to pull any recipe from{" "}
          {site.domain} into a clean format — just the ingredients and
          instructions, without the ads or distractions.
        </p>
      </section>

      {/* Extraction tool */}
      <section style={{ paddingBottom: "32px" }}>
        <ExtractTool
          placeholder={`Paste any ${site.name} URL here...`}
          subtitle={`Works with any recipe on ${site.domain}`}
        />
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
