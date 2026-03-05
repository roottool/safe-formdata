import { assert, describe, expect, it } from "vitest";
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

	it("returns empty data and no issues for empty FormData", () => {
		const fd = new FormData();

		const result = parse(fd);

		expect(result.issues).toEqual([]);
		expect(result.data).toEqual({});
	});

	it("stores File values in data", () => {
		const fd = new FormData();
		const file = new File(["content"], "test.txt", { type: "text/plain" });
		fd.append("upload", file);

		const result = parse(fd);

		assert(result.data !== null);
		expect(result.issues).toEqual([]);
		expect(result.data["upload"]).toBeInstanceOf(File);
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
		expect(issue.key).toBe("a");
	});

	it("reports an issue for each occurrence beyond the first", () => {
		const fd = new FormData();
		fd.append("a", "1");
		fd.append("a", "2");
		fd.append("a", "3");

		const result = parse(fd);

		expect(result.data).toBeNull();
		expect(result.issues).toHaveLength(2);
		for (const issue of result.issues) {
			expect(issue.code).toBe("duplicate_key");
			expect(issue.key).toBe("a");
		}
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
		expect(issue.key).toBe("items[]");
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
	});

	it("handles non-string keys gracefully if they occur", () => {
		const fd = new FormData();
		// Handle cases where null or undefined keys might be injected
		// by specific environments or legacy polyfills.
		fd.append(null as any, "value");

		const result = parse(fd);
		expect(result.data).toBeNull();
		expect(result.issues[0]?.code).toBe("invalid_key");
	});
});

describe("boundary constraints", () => {
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
