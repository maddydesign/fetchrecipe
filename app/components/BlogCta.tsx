import Link from "next/link";

export default function BlogCta() {
  return (
    <div
      style={{
        border: "0.5px solid var(--gray-border)",
        padding: "32px",
        marginTop: "48px",
        textAlign: "center",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "18px",
          fontWeight: 400,
          color: "var(--black)",
          margin: "0 0 8px 0",
        }}
      >
        Try FetchRecipe
      </p>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "var(--black)",
          margin: "0 0 20px 0",
          maxWidth: "45ch",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Paste any recipe URL and get just the ingredients and instructions. No
        ads, no life stories.
      </p>
      <Link
        href="/"
        style={{
          display: "inline-block",
          fontFamily: "var(--font-body)",
          fontSize: "14px",
          fontWeight: 500,
          padding: "12px 24px",
          background: "var(--black)",
          color: "var(--white)",
          textDecoration: "none",
          transition:
            "background 160ms var(--ease-out), transform 100ms var(--ease-out)",
        }}
      >
        Extract a recipe
      </Link>
    </div>
  );
}
