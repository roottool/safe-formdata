/**
 * Keys explicitly forbidden to prevent prototype pollution attacks.
 *
 * These keys are reserved properties on `Object.prototype` and must never
 * be allowed in parsed FormData, regardless of their values or context.
 *
 * - `__proto__`: Legacy prototype accessor
 * - `prototype`: Function prototype property
 * - `constructor`: Object constructor reference
 *
 * @see {@link https://github.com/roottool/safe-formdata/blob/main/AGENTS.md#prototype-safety AGENTS.md > Security rules > Prototype safety}
 */
export const FORBIDDEN_KEYS: ReadonlySet<string> = new Set([
	"__proto__",
	"prototype",
	"constructor",
]);
