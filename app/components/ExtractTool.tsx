"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Recipe, ExtractResponse } from "@/types/recipe";
import RecipeCard from "./RecipeCard";
import RecipeJsonLd from "./RecipeJsonLd";

const STATUS_MESSAGES = [
  "Fetching the page...",
  "Reading the recipe...",
  "Extracting ingredients...",
  "Almost there...",
];

export default function ExtractTool({
  placeholder = "Paste a recipe URL...",
  subtitle,
}: {
  placeholder?: string;
  subtitle?: string;
}) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusIdx, setStatusIdx] = useState(0);
  const statusInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Rotate loading status messages
  useEffect(() => {
    if (loading) {
      setStatusIdx(0);
      statusInterval.current = setInterval(() => {
        setStatusIdx((prev) =>
          prev < STATUS_MESSAGES.length - 1 ? prev + 1 : prev
        );
      }, 4000);
    } else {
      if (statusInterval.current) clearInterval(statusInterval.current);
    }
    return () => {
      if (statusInterval.current) clearInterval(statusInterval.current);
    };
  }, [loading]);

  const extract = useCallback(
    async (targetUrl: string) => {
      if (loading) return;

      setLoading(true);
      setRecipe(null);
      setError(null);

      try {
        const res = await fetch("/api/extract", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl }),
        });

        const data: ExtractResponse = await res.json();

        if (data.success) {
          setRecipe(data.recipe);
          // Scroll to result
          setTimeout(() => {
            resultRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        } else {
          setError("Sorry, we couldn't read the recipe on that page. Please paste another URL.");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    extract(url.trim());
  };

  return (
    <>
      {/* Extraction input */}
      <div
        className="no-print"
        style={{ maxWidth: "520px", margin: "0 auto", padding: "0 20px" }}
      >
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              border: "0.5px solid var(--gray-border)",
              transition: "border-color 200ms var(--ease-out)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "var(--black)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = "var(--gray-border)")
            }
          >
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={placeholder}
              required
              disabled={loading}
              style={{
                flex: 1,
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 400,
                padding: "14px 16px",
                border: "none",
                outline: "none",
                color: "var(--black)",
                background: "transparent",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 500,
                padding: "14px 24px",
                background: loading ? "#666" : "var(--black)",
                color: "var(--white)",
                border: "none",
                cursor: loading ? "default" : "pointer",
                whiteSpace: "nowrap",
                transition:
                  "background 160ms var(--ease-out), transform 100ms var(--ease-out)",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#333";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background = "var(--black)";
              }}
              onMouseDown={(e) => {
                if (!loading)
                  e.currentTarget.style.transform = "scale(0.98)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {loading ? "Fetching..." : "Fetch recipe"}
            </button>
          </div>
        </form>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            fontWeight: 400,
            color: "var(--black)",
            letterSpacing: "0.02em",
            marginTop: "12px",
            textAlign: "center",
          }}
        >
          {subtitle ?? "Works with AllRecipes, Food Network, Bon Appetit, and hundreds more"}
        </p>

        {/* Error state */}
        {error && !loading && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 400,
              color: "#9B4444",
              background: "#F8F0F0",
              padding: "14px 20px",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div
          className="no-print"
          style={{
            maxWidth: "520px",
            margin: "48px auto 0",
            padding: "0 20px",
            textAlign: "center",
          }}
        >
          {/* Progress line */}
          <div
            style={{
              width: "100%",
              height: "1px",
              background: "var(--gray-border)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "1px",
                background: "var(--black)",
                animation: "progressLine 12s var(--ease-out) forwards",
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--black)",
              marginTop: "16px",
              transition: "opacity 200ms var(--ease-out)",
            }}
          >
            {STATUS_MESSAGES[statusIdx]}
          </p>
          {/* Loading illustration */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
              minHeight: "400px",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/loading.gif"
              alt="Loading recipe"
              style={{
                width: "250px",
                height: "250px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>
      )}

      {/* Recipe structured data */}
      {recipe && !loading && <RecipeJsonLd recipe={recipe} />}

      {/* Recipe result */}
      {recipe && !loading && (
        <div
          ref={resultRef}
          className="recipe-result-wrap"
          style={{
            background: "var(--cream)",
            marginTop: "64px",
            padding: "48px 20px 64px",
          }}
        >
          {/* Action buttons — above the card */}
          <div
            className="no-print"
            style={{
              maxWidth: "780px",
              margin: "0 auto 20px",
              display: "flex",
              gap: "12px",
            }}
          >
            <button
              onClick={() => window.print()}
              style={{
                flex: 1,
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 24px",
                background: "var(--black)",
                color: "var(--white)",
                border: "none",
                cursor: "pointer",
                transition:
                  "background 160ms var(--ease-out), transform 100ms var(--ease-out)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#333")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--black)")
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Print recipe
            </button>
            <button
              style={{
                flex: 1,
                fontFamily: "var(--font-body)",
                fontSize: "14px",
                fontWeight: 500,
                padding: "12px 24px",
                background: "var(--white)",
                color: "var(--black)",
                border: "none",
                cursor: "pointer",
                transition:
                  "background 160ms var(--ease-out), transform 100ms var(--ease-out)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#F5F5F5")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--white)")
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              Save recipe
            </button>
          </div>

          <RecipeCard recipe={recipe} />
        </div>
      )}

      {/* CSS keyframe animations */}
      <style jsx global>{`
        @keyframes progressLine {
          0% {
            width: 0%;
          }
          30% {
            width: 40%;
          }
          60% {
            width: 65%;
          }
          80% {
            width: 80%;
          }
          100% {
            width: 95%;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Mobile responsive for recipe card (screen only — print has its own layout) */
        @media screen and (max-width: 768px) {
          .recipe-header {
            grid-template-columns: 1fr !important;
          }

          .recipe-card-body {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }

          .recipe-card {
            padding: 32px 24px !important;
          }
        }
      `}</style>
    </>
  );
}
