import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const BLOG_DIR = path.join(process.cwd(), "content/blog");

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fm: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fm[key] = value;
  }
  return fm;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts: BlogPost[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const fm = parseFrontmatter(raw);
    if (!fm.slug || !fm.title) continue;

    posts.push({
      slug: fm.slug,
      title: fm.title,
      description: fm.description ?? "",
      date: fm.date ?? "",
    });
  }

  // Sort by date, newest first
  posts.sort((a, b) => (b.date > a.date ? 1 : -1));
  return posts;
}

export function getPostBySlug(slug: string): (BlogPost & { content: string }) | null {
  if (!fs.existsSync(BLOG_DIR)) return null;

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
    const fm = parseFrontmatter(raw);
    if (fm.slug !== slug) continue;

    // Strip frontmatter from content
    const content = raw.replace(/^---\n[\s\S]*?\n---\n*/, "").trim();

    return {
      slug: fm.slug,
      title: fm.title,
      description: fm.description ?? "",
      date: fm.date ?? "",
      content,
    };
  }

  return null;
}
