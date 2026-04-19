import Link from "next/link";

export default function SiteNotFound() {
  return (
    <section
      style={{
        maxWidth: "520px",
        margin: "0 auto",
        padding: "120px 20px",
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "36px",
          fontWeight: 400,
          lineHeight: 1.15,
          color: "var(--black)",
          margin: 0,
        }}
      >
        Site not found
      </h1>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "15px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "var(--black)",
          marginTop: "16px",
        }}
      >
        We don&apos;t have a dedicated page for that site, but FetchRecipe works
        with hundreds of recipe websites.
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
          marginTop: "28px",
          transition:
            "background 160ms var(--ease-out), transform 100ms var(--ease-out)",
        }}
      >
        Go to FetchRecipe
      </Link>
    </section>
  );
}
