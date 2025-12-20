/**
 * Keys explicitly forbidden to prevent prototype pollution attacks.
 *
 * These keys are reserved properties on `Object.prototype` and must never
 * be allowed in parsed FormData, regardless of their values or context.
 *
 * The forbidden keys are:
 * - `__proto__`: Legacy prototype accessor
 * - `prototype`: Function prototype property
 * - `constructor`: Object constructor reference
 *
 * Any FormData entry containing these keys will trigger a `forbidden_key` issue,
 * causing the parse operation to fail with `data: null`.
 *
 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md#prototype-safety AGENTS.md > Security rules > Prototype safety}
 */
export const FORBIDDEN_KEYS = new Set<string>([
	"__proto__",
	"prototype",
	"constructor",
] as const satisfies readonly string[]);
