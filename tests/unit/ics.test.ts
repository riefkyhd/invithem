import { describe, expect, it } from "vitest";
import { generateIcsFile } from "@/lib/utils/ics";

describe("generateIcsFile", () => {
  it("produces valid VCALENDAR structure", () => {
    const ics = generateIcsFile({
      title: "Wedding Reception",
      description: "Join us\nfor celebration",
      location: "Grand Hyatt Jakarta",
      start: new Date("2026-11-15T04:00:00.000Z"),
      end: new Date("2026-11-15T08:00:00.000Z"),
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
    expect(ics).toContain("SUMMARY:Wedding Reception");
    expect(ics).toContain("LOCATION:Grand Hyatt Jakarta");
    expect(ics).toContain("DESCRIPTION:Join us\\nfor celebration");
  });

  it("formats dates without separators", () => {
    const ics = generateIcsFile({
      title: "Akad",
      description: "",
      location: "Masjid",
      start: new Date("2026-11-15T02:00:00.000Z"),
      end: new Date("2026-11-15T03:00:00.000Z"),
    });
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}Z/);
  });
});
