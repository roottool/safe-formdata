import { describe, expect, it } from "vitest";
import { createIssue } from "#issues/createIssue";
import type { ParseIssue } from "#types/ParseIssue";

describe("createIssue", () => {
	it("preserves the issue code", () => {
		const issue = createIssue("duplicate_key", "a");

		expect(issue.code).toBe("duplicate_key");
	});

	it("preserves the key", () => {
		const issue = createIssue("forbidden_key", "__proto__");

		expect(issue.key).toBe("__proto__");
	});

	it("returns a plain object", () => {
		const issue = createIssue("forbidden_key", "__proto__");

		expect(Object.getPrototypeOf(issue)).toBe(Object.prototype);
	});

	it("matches ParseIssue shape", () => {
		const issue: ParseIssue = createIssue("forbidden_key", "__proto__");

		expect(issue).toHaveProperty("code");
		expect(issue).toHaveProperty("key");
	});
});
