import { describe, it, expect } from "vitest";
import {
  cn,
  formatCurrency,
  formatNumber,
  formatFileSize,
  formatDate,
  formatRelativeTime,
  generateId,
  truncate,
  slugify,
} from "@/lib/utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("merges class names", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("handles conditional classes", () => {
      const result = cn("base", false && "hidden", "extra");
      expect(result).toContain("base");
      expect(result).toContain("extra");
      expect(result).not.toContain("hidden");
    });
  });

  describe("formatCurrency", () => {
    it("formats zero", () => {
      expect(formatCurrency(0)).toBe("$0");
    });

    it("formats large numbers", () => {
      expect(formatCurrency(1284920)).toBe("$1,284,920");
    });

    it("formats small numbers", () => {
      expect(formatCurrency(49.99)).toBe("$50");
    });
  });

  describe("formatNumber", () => {
    it("formats thousands as K", () => {
      expect(formatNumber(1200)).toBe("1.2K");
    });

    it("formats millions as M", () => {
      expect(formatNumber(1500000)).toBe("1.5M");
    });

    it("returns raw number for small values", () => {
      expect(formatNumber(42)).toBe("42");
    });
  });

  describe("formatFileSize", () => {
    it("formats zero bytes", () => {
      expect(formatFileSize(0)).toBe("0 Bytes");
    });

    it("formats kilobytes", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
    });

    it("formats megabytes", () => {
      expect(formatFileSize(1048576)).toBe("1 MB");
    });
  });

  describe("truncate", () => {
    it("returns original string if shorter than limit", () => {
      expect(truncate("hello", 10)).toBe("hello");
    });

    it("truncates long strings", () => {
      expect(truncate("hello world", 5)).toBe("hello...");
    });
  });

  describe("generateId", () => {
    it("generates unique ids", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it("returns a string", () => {
      expect(typeof generateId()).toBe("string");
    });
  });

  describe("slugify", () => {
    it("converts text to slug", () => {
      expect(slugify("Hello World")).toBe("hello-world");
    });

    it("removes special characters", () => {
      expect(slugify("Hello! @World#")).toBe("hello-world");
    });
  });
});
