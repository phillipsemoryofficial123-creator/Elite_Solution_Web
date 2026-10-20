import { describe, expect, it } from "vitest";
import {
  evaluateCrawlUrl,
  isBlockedHostname,
  isLinkLocalIpv4,
  isLocalhostHostname,
  isLoopbackIpv4,
  isPrivateIpv4,
  isPrivateOrLocalIpv6,
  isSafeCrawlUrl,
  isSafeExternalCheckUrl,
} from "./url-safety";

const ORIGIN = "https://www.elitesolutionusa.com";

describe("private / localhost blockers", () => {
  it("detects loopback IPv4", () => {
    expect(isLoopbackIpv4("127.0.0.1")).toBe(true);
    expect(isLoopbackIpv4("127.0.0.2")).toBe(true);
    expect(isLoopbackIpv4("192.168.1.1")).toBe(false);
  });

  it("detects RFC1918 private IPv4 ranges", () => {
    expect(isPrivateIpv4("10.0.0.1")).toBe(true);
    expect(isPrivateIpv4("172.16.0.1")).toBe(true);
    expect(isPrivateIpv4("172.31.255.255")).toBe(true);
    expect(isPrivateIpv4("172.15.0.1")).toBe(false);
    expect(isPrivateIpv4("172.32.0.1")).toBe(false);
    expect(isPrivateIpv4("192.168.0.1")).toBe(true);
    expect(isPrivateIpv4("8.8.8.8")).toBe(false);
  });

  it("detects link-local IPv4", () => {
    expect(isLinkLocalIpv4("169.254.1.1")).toBe(true);
    expect(isLinkLocalIpv4("169.255.1.1")).toBe(false);
  });

  it("detects localhost hostnames", () => {
    expect(isLocalhostHostname("localhost")).toBe(true);
    expect(isLocalhostHostname("LOCALHOST")).toBe(true);
    expect(isLocalhostHostname("foo.localhost")).toBe(true);
    expect(isLocalhostHostname("127.0.0.1")).toBe(true);
    expect(isLocalhostHostname("www.elitesolutionusa.com")).toBe(false);
  });

  it("detects IPv6 loopback / ULA / link-local", () => {
    expect(isPrivateOrLocalIpv6("::1")).toBe(true);
    expect(isPrivateOrLocalIpv6("[::1]")).toBe(true);
    expect(isPrivateOrLocalIpv6("fe80::1")).toBe(true);
    expect(isPrivateOrLocalIpv6("fd12::1")).toBe(true);
    expect(isPrivateOrLocalIpv6("2001:db8::1")).toBe(false);
  });

  it("isBlockedHostname returns expected reasons", () => {
    expect(isBlockedHostname("localhost")).toBe("localhost");
    expect(isBlockedHostname("10.1.2.3")).toBe("private_ip");
    expect(isBlockedHostname("169.254.10.10")).toBe("link_local");
    expect(isBlockedHostname("www.elitesolutionusa.com")).toBeNull();
  });
});

describe("isSafeCrawlUrl", () => {
  it("allows same-origin https URLs", () => {
    expect(isSafeCrawlUrl(`${ORIGIN}/about`, ORIGIN)).toBe(true);
    expect(isSafeCrawlUrl(`${ORIGIN}/`, ORIGIN)).toBe(true);
  });

  it("blocks localhost and private IPs on the frontier", () => {
    expect(isSafeCrawlUrl("http://localhost/admin", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://127.0.0.1/", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://10.0.0.5/secret", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://192.168.1.10/", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://172.16.0.1/", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://[::1]/", ORIGIN)).toBe(false);
    expect(isSafeCrawlUrl("http://169.254.1.1/", ORIGIN)).toBe(false);
  });

  it("blocks non-http(s), credentials, and off-origin frontier URLs", () => {
    expect(isSafeCrawlUrl("ftp://www.elitesolutionusa.com/a", ORIGIN)).toBe(
      false,
    );
    expect(
      isSafeCrawlUrl("https://user:pass@www.elitesolutionusa.com/", ORIGIN),
    ).toBe(false);
    expect(isSafeCrawlUrl("https://evil.example/path", ORIGIN)).toBe(false);

    const creds = evaluateCrawlUrl(
      "https://user:pass@www.elitesolutionusa.com/",
      ORIGIN,
    );
    expect(creds.ok).toBe(false);
    if (!creds.ok) expect(creds.reason).toBe("credentials");

    const off = evaluateCrawlUrl("https://evil.example/path", ORIGIN);
    expect(off.ok).toBe(false);
    if (!off.ok) expect(off.reason).toBe("off_origin");
  });

  it("allows external http(s) public hosts for HEAD checks only", () => {
    expect(isSafeExternalCheckUrl("https://example.com/page", ORIGIN)).toBe(
      true,
    );
    expect(isSafeExternalCheckUrl("http://10.0.0.1/", ORIGIN)).toBe(false);
    expect(isSafeExternalCheckUrl("http://localhost/", ORIGIN)).toBe(false);
  });
});
