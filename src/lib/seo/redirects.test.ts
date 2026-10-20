import { describe, expect, it } from "vitest";
import { wouldCreateRedirectLoop } from "@/lib/seo/redirects";

describe("wouldCreateRedirectLoop", () => {
  it("detects direct self-loop", () => {
    expect(wouldCreateRedirectLoop("/a", "/a", [])).toBe(true);
  });

  it("detects two-node cycle", () => {
    expect(
      wouldCreateRedirectLoop("/b", "/a", [{ from_path: "/a", to_url: "/b" }]),
    ).toBe(true);
  });

  it("allows acyclic redirect", () => {
    expect(
      wouldCreateRedirectLoop("/old", "/new", [
        { from_path: "/legacy", to_url: "/old" },
      ]),
    ).toBe(false);
  });

  it("allows external absolute targets", () => {
    expect(
      wouldCreateRedirectLoop("/go", "https://example.com/out", []),
    ).toBe(false);
  });
});
