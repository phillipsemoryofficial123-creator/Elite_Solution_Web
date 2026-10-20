import { describe, expect, it } from "vitest";
import {
  canManageSettings,
  canMutateContent,
  canReadAdmin,
  isSeoRole,
} from "@/lib/seo/roles";

describe("seo role helpers", () => {
  it("validates roles", () => {
    expect(isSeoRole("owner")).toBe(true);
    expect(isSeoRole("hacker")).toBe(false);
  });

  it("gates mutate and settings", () => {
    expect(canReadAdmin("viewer")).toBe(true);
    expect(canMutateContent("viewer")).toBe(false);
    expect(canMutateContent("editor")).toBe(true);
    expect(canManageSettings("editor")).toBe(false);
    expect(canManageSettings("admin")).toBe(true);
  });
});
