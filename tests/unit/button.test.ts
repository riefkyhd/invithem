import { describe, expect, it } from "vitest";
import { buttonClassName } from "@/components/ui/Button";

describe("buttonClassName", () => {
  it("includes rounded-full base styles", () => {
    const classes = buttonClassName({ variant: "primary", size: "md" });
    expect(classes).toContain("rounded-full");
    expect(classes).toContain("bg-accent");
  });

  it("applies variant styles", () => {
    expect(buttonClassName({ variant: "secondary" })).toContain("border-card-border");
    expect(buttonClassName({ variant: "ghost" })).toContain("text-muted");
    expect(buttonClassName({ variant: "danger" })).toContain("text-red-400");
  });

  it("applies size styles", () => {
    expect(buttonClassName({ size: "sm" })).toContain("px-3");
    expect(buttonClassName({ size: "lg" })).toContain("px-8");
  });

  it("applies active nav styles on ghost", () => {
    const classes = buttonClassName({ variant: "ghost", active: true });
    expect(classes).toContain("bg-accent/15");
    expect(classes).toContain("text-accent");
  });

  it("merges custom className", () => {
    expect(buttonClassName({ className: "w-full" })).toContain("w-full");
  });
});
