import { FORBIDDEN_KEYS } from "#issues/forbiddenKeys";
import { createIssue } from "#issues/createIssue";
import type { ParseResult } from "#types/ParseResult";

/**
 * Parses FormData into a flat JavaScript object with strict boundary enforcement.
 *
 * This function establishes a security-focused boundary between untrusted FormData input
 * and application logic by:
 * - Detecting duplicate, forbidden, and invalid keys
 * - Treating keys as opaque strings (no structural inference)
 * - Returning null data if any issues are detected (no partial success)
 *
 * @param formData - The FormData instance to parse
 * @returns ParseResult containing either parsed data or issues (never both)
 *
 * @example
 * ```ts
 * const fd = new FormData()
 * fd.append('name', 'alice')
 * const result = parse(fd)
 *
 * if (result.data) {
 *   // Success: result.data is { name: 'alice' }
 * } else {
 *   // Failure: result.issues contains detected problems
 * }
 * ```
 *
 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md AGENTS.md} for design rules
 */
export function parse(formData: FormData): ParseResult {
	const data = Object.create(null) as Record<string, string | File>;
	const issues = [];
	const seenKeys = new Set<string>();

	for (const [key, value] of formData.entries()) {
		if (typeof key !== "string" || key.length === 0) {
			issues.push(createIssue("invalid_key", { key }));
			continue;
		}

		if (FORBIDDEN_KEYS.has(key)) {
			issues.push(createIssue("forbidden_key", { key }));
			continue;
		}

		if (seenKeys.has(key)) {
			issues.push(createIssue("duplicate_key", { key }));
			continue;
		}

		seenKeys.add(key);
		data[key] = value;
	}

	return issues.length > 0
		? {
				data: null,
				issues,
			}
		: {
				data,
				issues: [],
			};
}
