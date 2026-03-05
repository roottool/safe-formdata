import type { ParseIssue } from "#types/ParseIssue";
import type { ParseResult } from "#types/ParseResult";

const FORBIDDEN_KEYS: ReadonlySet<string> = new Set(["__proto__", "prototype", "constructor"]);

/**
 * Parses FormData into a flat JavaScript object.
 *
 * Fails completely if any entry violates the rules below — no partial success:
 * - Duplicate, forbidden, and invalid keys are rejected
 * - Keys are treated as opaque strings (no structural inference)
 *
 * @param formData - The FormData instance to parse
 * @returns ParseResult containing either parsed data or issues, never both
 *
 * @example
 * ```ts
 * const fd = new FormData()
 * fd.append('name', 'alice')
 * const result = parse(fd)
 *
 * if (result.data !== null) {
 *   // Success: result.data is { name: 'alice' }
 * } else {
 *   // Failure: result.issues contains detected problems
 * }
 * ```
 *
 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md AGENTS.md} for design rules
 */
export function parse(formData: FormData): ParseResult {
	const data: Record<string, string | File> = Object.create(null);
	const issues: ParseIssue[] = [];
	const seenKeys = new Set<string>();

	for (const [key, value] of formData.entries()) {
		if (typeof key !== "string" || key.length === 0) {
			issues.push({ code: "invalid_key", key });
			continue;
		}

		if (FORBIDDEN_KEYS.has(key)) {
			issues.push({ code: "forbidden_key", key });
			continue;
		}

		if (seenKeys.has(key)) {
			issues.push({ code: "duplicate_key", key });
			continue;
		}

		seenKeys.add(key);
		data[key] = value;
	}

	// Destructure to let TypeScript infer [ParseIssue, ...ParseIssue[]] without a type assertion
	const [firstIssue, ...restIssues] = issues;
	return firstIssue !== undefined
		? {
				data: null,
				issues: [firstIssue, ...restIssues],
			}
		: {
				data,
				issues: [],
			};
}
