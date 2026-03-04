import type { IssueCode } from "#types/IssueCode";
import type { ParseIssue } from "#types/ParseIssue";

/** @internal */
export function createIssue(code: IssueCode, key: string): ParseIssue {
	return { code, key };
}
