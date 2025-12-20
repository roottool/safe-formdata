import { describe, it, expect } from "vitest";
import { createIssue } from "#issues/createIssue";
import type { ParseIssue } from "#types/ParseIssue";

describe("createIssue", () => {
	it("creates an issue with empty path", () => {
		const issue = createIssue("forbidden_key", { key: "__proto__" });

		expect(issue.path).toEqual([]);
	});

	it("preserves the issue code", () => {
		const issue = createIssue("duplicate_key", { key: "a" });

		expect(issue.code).toBe("duplicate_key");
	});

	it("includes provided payload fields", () => {
		const issue = createIssue("invalid_key", { key: "" });

		expect(issue).toMatchObject({
			key: "",
		});
	});

	it("returns a plain object", () => {
		const issue = createIssue("forbidden_key", { key: "__proto__" });

		expect(Object.getPrototypeOf(issue)).toBe(Object.prototype);
	});

	it("matches ParseIssue shape", () => {
		const issue: ParseIssue = createIssue("forbidden_key", { key: "__proto__" });

		expect(issue).toHaveProperty("code");
		expect(issue).toHaveProperty("path");
	});
});
