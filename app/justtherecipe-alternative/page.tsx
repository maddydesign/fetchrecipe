import type { Metadata } from "next";
import ExtractTool from "@/app/components/ExtractTool";

export const metadata: Metadata = {
  title: "Free JustTheRecipe Alternative — Print Recipes Without Paying",
  description:
    "JustTheRecipe charges for printing. FetchRecipe doesn't. Paste any recipe URL and get a clean, printable recipe card — free, forever.",
  openGraph: {
    title: "Free JustTheRecipe Alternative — Print Recipes Without Paying",
    description:
      "JustTheRecipe charges for printing. FetchRecipe doesn't. Paste any recipe URL and get a clean, printable recipe card — free, forever.",
  },
};

const comparison = [
  { feature: "Recipe extraction", jtr: "Free", fr: "Free" },
  { feature: "Print recipe", jtr: "Paid ($2/mo)", fr: "Free" },
  { feature: "Save recipes", jtr: "Not available free", fr: "Free (with account)" },
  { feature: "Meal planning", jtr: "Not available", fr: "Coming soon" },
  { feature: "Video extraction", jtr: "Not available", fr: "Coming soon" },
];

export default function JustTheRecipeAlternativePage() {
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
          className="jtr-headline"
        >
          A Free Alternative to JustTheRecipe
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: 1.6,
            color: "var(--black)",
            maxWidth: "520px",
            margin: "24px auto 0",
          }}
        >
          JustTheRecipe is a good tool — it strips away the clutter and gets
          you the recipe. But it charges for printing and limits free usage.
          FetchRecipe does everything JustTheRecipe does, and keeps printing
          free, always. No subscription, no credit card, no account required.
        </p>
      </section>

      {/* Extraction tool */}
      <section style={{ paddingBottom: "32px" }}>
        <ExtractTool placeholder="Paste any recipe URL here..." />
      </section>

      {/* Comparison table */}
      <section
        className="no-print"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "0.5px",
            background: "var(--gray-border)",
            margin: "0 auto 48px",
          }}
        />

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "var(--black)",
                  textAlign: "left",
                  padding: "12px 16px",
                  border: "0.5px solid var(--gray-border)",
                  width: "40%",
                }}
              />
              <th
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "var(--black)",
                  textAlign: "center",
                  padding: "12px 16px",
                  border: "0.5px solid var(--gray-border)",
                }}
              >
                JustTheRecipe
              </th>
              <th
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "16px",
                  fontWeight: 400,
                  color: "var(--black)",
                  textAlign: "center",
                  padding: "12px 16px",
                  border: "0.5px solid var(--gray-border)",
                }}
              >
                FetchRecipe
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.map((row) => (
              <tr key={row.feature}>
                <td
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "var(--black)",
                    padding: "12px 16px",
                    border: "0.5px solid var(--gray-border)",
                  }}
                >
                  {row.feature}
                </td>
                <td
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "var(--black)",
                    textAlign: "center",
                    padding: "12px 16px",
                    border: "0.5px solid var(--gray-border)",
                  }}
                >
                  {row.jtr}
                </td>
                <td
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "var(--black)",
                    textAlign: "center",
                    padding: "12px 16px",
                    border: "0.5px solid var(--gray-border)",
                  }}
                >
                  {row.fr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            fontWeight: 400,
            color: "var(--black)",
            textAlign: "center",
            marginTop: "24px",
          }}
        >
          No credit card. No account required to print.
        </p>
      </section>

      {/* Mobile responsive */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media screen and (max-width: 768px) {
            .jtr-headline {
              font-size: 32px !important;
            }
          }
        `,
        }}
      />
    </>
  );
}
