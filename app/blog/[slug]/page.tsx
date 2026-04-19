import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/data/blog";
import BlogCta from "@/app/components/BlogCta";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} — FetchRecipe`,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <header>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "32px",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--black)",
            margin: 0,
          }}
        >
          {post.title}
        </h1>
        {post.date && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 400,
              color: "var(--black)",
              letterSpacing: "0.02em",
              marginTop: "12px",
            }}
          >
            {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </header>

      <div
        className="blog-content"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: 1.6,
          color: "var(--black)",
          maxWidth: "65ch",
          marginTop: "40px",
        }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
      />

      <BlogCta />
    </article>
  );
}

/** Minimal markdown-to-HTML for the blog post body (headings, paragraphs, bold, links). */
function renderMarkdown(md: string): string {
  return md
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";

      // Headings
      const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = inlineMarkdown(headingMatch[2]);
        const style =
          level <= 2
            ? `font-family: var(--font-display); font-size: 18px; font-weight: 400; margin: 32px 0 12px 0;`
            : `font-family: var(--font-display); font-size: 16px; font-weight: 400; margin: 24px 0 8px 0;`;
        return `<h${level} style="${style}">${text}</h${level}>`;
      }

      // Paragraph
      return `<p style="margin: 0 0 16px 0;">${inlineMarkdown(trimmed)}</p>`;
    })
    .join("\n");
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: var(--black);">$1</a>');
}
