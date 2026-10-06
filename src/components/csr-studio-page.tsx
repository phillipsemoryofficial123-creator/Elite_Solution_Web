import { Reveal } from "@/components/reveal";
import { csrPage, type CsrToolId } from "@/data/csr-page";

const svgCommon = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function ToolIcon({ id }: { id: CsrToolId }) {
  if (id === "resume") {
    return (
      <svg {...svgCommon}>
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5" />
        <path d="M8 13h8" />
        <path d="M8 17h5" />
      </svg>
    );
  }

  return (
    <svg {...svgCommon}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5 20.5 21" />
      <path d="M8.5 11h5" />
      <path d="M11 8.5v5" />
    </svg>
  );
}

export function CsrStudioPage() {
  const { hero, tools } = csrPage;

  return (
    <div className="csr-studio">
      <section className="csr-hero">
        <div className="w">
          <div className="csr-head">
            <Reveal as="p" className="csr-eyebrow">
              {hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="csr-title">
                {hero.titleBefore}{" "}
                <span className="csr-accent">{hero.titleAccent}</span>
              </h1>
            </Reveal>
            <Reveal as="p" className="csr-lead" delay="60ms">
              {hero.lead}
            </Reveal>
          </div>

          <ul className="csr-tool-grid">
            {tools.map((tool, i) => (
              <Reveal
                key={tool.id}
                as="li"
                delay={`${100 + i * 80}ms`}
              >
                <a
                  className="csr-tool"
                  href={tool.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="csr-tool-ic" aria-hidden="true">
                    <ToolIcon id={tool.id} />
                  </span>
                  <strong>{tool.name}</strong>
                  <p>{tool.body}</p>
                  <span className="csr-tool-go">
                    {tool.cta}
                    <span aria-hidden="true"> →</span>
                  </span>
                </a>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
