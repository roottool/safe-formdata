import type { ParseResult } from "#types/ParseResult";

export { parse } from "#parse";

export type { IssueCode } from "#types/IssueCode";
export type { ParseIssue } from "#types/ParseIssue";
export type { ParseResult };

export type SuccessResult = Extract<ParseResult, { data: Record<string, string | File> }>;
export type FailureResult = Extract<ParseResult, { data: null }>;
