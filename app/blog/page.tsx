import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, tricks, and guides for getting the most out of your favorite recipe websites.",
  openGraph: {
    title: "Blog — FetchRecipe",
    description:
      "Tips, tricks, and guides for getting the most out of your favorite recipe websites.",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <section
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "48px",
          fontWeight: 400,
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          color: "var(--black)",
          margin: "0 0 48px 0",
        }}
      >
        Blog
      </h1>

      {posts.length === 0 && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "15px",
            color: "var(--black)",
          }}
        >
          Posts coming soon.
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        {posts.map((post) => (
          <article key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none" }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "28px",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  color: "var(--black)",
                  margin: 0,
                }}
              >
                {post.title}
              </h2>
            </Link>
            {post.date && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 400,
                  color: "var(--black)",
                  letterSpacing: "0.02em",
                  marginTop: "6px",
                  marginBottom: "0",
                }}
              >
                {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {post.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "var(--black)",
                  marginTop: "8px",
                  maxWidth: "65ch",
                }}
              >
                {post.description}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
