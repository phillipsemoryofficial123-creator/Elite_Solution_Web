"use client";

type SerpPreviewProps = {
  title: string;
  description: string;
  path: string;
  siteOrigin?: string;
};

function truncate(value: string, max: number): string {
  const trimmed = value.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1)}…`;
}

export function SerpPreview({
  title,
  description,
  path,
  siteOrigin = "https://www.elitesolutionusa.com",
}: SerpPreviewProps) {
  const displayUrl = `${siteOrigin.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const safeTitle = title.trim() || "Untitled page";
  const safeDescription =
    description.trim() || "Add a meta description to preview this result.";

  return (
    <div className="admin-serp-preview" aria-label="SERP preview">
      <p className="admin-serp-preview__eyebrow">Google-style preview</p>
      <p className="admin-serp-preview__url">{displayUrl}</p>
      <p className="admin-serp-preview__title">{truncate(safeTitle, 60)}</p>
      <p className="admin-serp-preview__desc">{truncate(safeDescription, 160)}</p>
      <p className="admin-serp-preview__meta">
        Title {safeTitle.length}/60 · Description {safeDescription.length}/160
      </p>
    </div>
  );
}

type OgPreviewProps = {
  title: string;
  description: string;
  image: string;
  path: string;
};

export function OgPreview({ title, description, image, path }: OgPreviewProps) {
  return (
    <div className="admin-og-preview" aria-label="Open Graph preview">
      <p className="admin-serp-preview__eyebrow">Open Graph preview</p>
      <div className="admin-og-preview__card">
        <div
          className="admin-og-preview__image"
          style={
            image.trim()
              ? { backgroundImage: `url(${image.trim()})` }
              : undefined
          }
        >
          {!image.trim() ? <span>No OG image</span> : null}
        </div>
        <div className="admin-og-preview__body">
          <p className="admin-og-preview__path">{path || "/"}</p>
          <p className="admin-og-preview__title">
            {title.trim() || "Untitled"}
          </p>
          <p className="admin-og-preview__desc">
            {description.trim() || "No description"}
          </p>
        </div>
      </div>
    </div>
  );
}
