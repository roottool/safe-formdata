import { assert, describe, it, expect } from "vitest";
import { parse } from "#parse";

describe("valid input", () => {
	it("parses flat FormData into an object", () => {
		const fd = new FormData();
		fd.append("name", "alice");
		fd.append("age", "20");

		const result = parse(fd);

		expect(result.issues).toEqual([]);
		expect(result.data).toEqual({
			name: "alice",
			age: "20",
		});
	});
});

describe("duplicate key detection", () => {
	it("reports duplicate_key and returns null data", () => {
		const fd = new FormData();
		fd.append("a", "1");
		fd.append("a", "2");

		const result = parse(fd);

		expect(result.data).toBeNull();
		expect(result.issues).toHaveLength(1);

		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("duplicate_key");
		expect(issue.path).toEqual([]);
	});

	it("treats bracket notation as opaque keys", () => {
		const fd = new FormData();
		fd.append("items[]", "1");
		fd.append("items[]", "2");

		const result = parse(fd);

		expect(result.data).toBeNull();
		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("duplicate_key");
	});
});

describe("forbidden key detection", () => {
	it("rejects __proto__", () => {
		const fd = new FormData();
		fd.append("__proto__", "polluted");

		const result = parse(fd);

		expect(result.data).toBeNull();
		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("forbidden_key");
	});

	it("rejects constructor", () => {
		const fd = new FormData();
		fd.append("constructor", "x");

		const result = parse(fd);

		expect(result.data).toBeNull();
		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("forbidden_key");
	});

	it("rejects prototype", () => {
		const fd = new FormData();
		fd.append("prototype", "malicious");

		const result = parse(fd);

		expect(result.data).toBeNull();
		expect(result.issues).toHaveLength(1);
		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("forbidden_key");
		expect(issue.key).toBe("prototype");
		expect(issue.path).toEqual([]);
	});
});

describe("invalid key detection", () => {
	it("rejects empty string keys", () => {
		const fd = new FormData();
		fd.append("", "empty-key-value");

		const result = parse(fd);

		expect(result.data).toBeNull();
		expect(result.issues).toHaveLength(1);
		const issue = result.issues[0];
		assert(issue);
		expect(issue.code).toBe("invalid_key");
		expect(issue.key).toBe("");
		expect(issue.path).toEqual([]);
	});
});

describe("boundary constraints", () => {
	it("always returns empty path", () => {
		const fd = new FormData();
		fd.append("__proto__", "x");

		const result = parse(fd);

		const issue = result.issues[0];
		assert(issue);
		expect(issue.path).toEqual([]);
	});

	it("creates data object with no prototype", () => {
		const fd = new FormData();
		fd.append("a", "1");

		const result = parse(fd);

		expect(Object.getPrototypeOf(result.data)).toBeNull();
	});

	it("returns null data if any issue exists", () => {
		const fd = new FormData();
		fd.append("ok", "1");
		fd.append("__proto__", "x");

		const result = parse(fd);

		expect(result.data).toBeNull();
		expect(result.issues.length).toBeGreaterThan(0);
	});
});
