import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { serviceGroupHref, serviceGroups } from "@/data/services";
import { nav, site } from "@/data/site";

type SocialId = (typeof site.social)[number]["id"];

function SocialIcon({ id }: { id: SocialId }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
    focusable: false as const,
  };

  switch (id) {
    case "facebook":
      return (
        <svg {...common}>
          <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 2.146 2.146 0 0 0-1.637.247c-.39.242-.583.64-.583 1.198v2.526h3.29l-.433 3.667h-2.857v7.98H9.101Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.24 8.34h4.52V24H.24V8.34zM8.34 8.34h4.33v2.13h.06c.6-1.14 2.08-2.34 4.28-2.34 4.58 0 5.42 3.01 5.42 6.93V24h-4.52v-7.75c0-1.85-.03-4.22-2.57-4.22-2.57 0-2.96 2.01-2.96 4.09V24H8.34V8.34z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.61.24 1.05.52 1.51.98.46.46.74.9.98 1.51.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43-.24.61-.52 1.05-.98 1.51-.46.46-.9.74-1.51.98-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4-.61-.24-1.05-.52-1.51-.98-.46-.46-.74-.9-.98-1.51-.16-.46-.35-1.26-.4-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.24-.61.52-1.05.98-1.51.46-.46.9-.74 1.51-.98.46-.16 1.26-.35 2.43-.4C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.52.01-4.76.07-.98.04-1.51.21-1.86.35-.47.18-.8.4-1.15.75-.35.35-.57.68-.75 1.15-.14.35-.3.88-.35 1.86-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.98.21 1.51.35 1.86.18.47.4.8.75 1.15.35.35.68.57 1.15.75.35.14.88.3 1.86.35 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.98-.04 1.51-.21 1.86-.35.47-.18.8-.4 1.15-.75.35-.35.57-.68.75-1.15.14-.35.3-.88.35-1.86.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.98-.21-1.51-.35-1.86-.18-.47-.4-.8-.75-1.15-.35-.35-.68-.57-1.15-.75-.35-.14-.88-.3-1.86-.35-1.24-.06-1.61-.07-4.76-.07z" />
          <path d="M12 6.86A5.14 5.14 0 1 0 12 17.14 5.14 5.14 0 0 0 12 6.86zm0 8.48A3.34 3.34 0 1 1 12 8.66a3.34 3.34 0 0 1 0 6.68z" />
          <circle cx="17.34" cy="6.66" r="1.2" />
        </svg>
      );
    default:
      return null;
  }
}

export function SiteFooter() {
  const pakistan = site.offices.find((office) => office.id === "pakistan");
  const otherOffices = site.offices.filter((office) => office.id !== "pakistan");

  return (
    <footer>
      <div className="w">
        <div className="ft">
          <div className="ft-brand">
            <Link className="ft-brand-link" href="/" aria-label="Elite Solution home">
              <BrandLogo />
            </Link>
            <p>{site.tagline}</p>
            <div className="ft-social" aria-label="Social media">
              {site.social.map((item) => (
                <a
                  key={item.id}
                  className="ft-social-link"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  title={item.label}
                >
                  <SocialIcon id={item.id} />
                </a>
              ))}
            </div>
          </div>

          <nav className="ft-col" aria-label="Footer">
            <h3>Explore</h3>
            <div className="fl">
              {nav
                .filter((item) => !item.cta)
                .map((item) =>
                  item.external ? (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link key={item.label} href={item.href}>
                      {item.label}
                    </Link>
                  ),
                )}
            </div>
          </nav>

          <div className="ft-col">
            <h3>Services</h3>
            <div className="fl">
              {serviceGroups.map((group) => (
                <Link key={group.id} href={serviceGroupHref(group)}>
                  {group.name}
                </Link>
              ))}
              <Link href="/services/non-financial/web-development">
                Web development
              </Link>
              <Link href="/portfolio">Featured work</Link>
            </div>
          </div>

          <div className="ft-side">
            <h3>Contact</h3>
            <ul className="ft-contact">
                <li>
                  <span>Phone</span>
                  <a href={site.phoneHref}>{site.phone}</a>
                </li>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                {otherOffices.map((office) => (
                  <li key={office.id}>
                    <span>{office.label}</span>
                    <p>{office.address}</p>
                    <a href={`mailto:${office.email}`}>{office.email}</a>
                    <a href={office.phoneHref}>{office.phone}</a>
                  </li>
                ))}
              </ul>
            {pakistan ? (
              <ul className="ft-contact ft-pk">
                <li>
                  <span>{pakistan.label}</span>
                  <p>{pakistan.address}</p>
                  <a href={`mailto:${pakistan.email}`}>{pakistan.email}</a>
                  <a href={pakistan.phoneHref}>{pakistan.phone}</a>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
