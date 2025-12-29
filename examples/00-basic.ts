import { parse } from "#safe-formdata";

/**
 * Minimal example
 * - basic fields
 * - validation guard
 * - explicit type narrowing for FormData values
 */

const formData = new FormData();
formData.set("name", "Alice");
formData.set("age", "20");

const result = parse(formData);

if (result.data === null) {
	// Validation failed
	console.error(result.issues);
	throw new Error("Invalid FormData");
}

// From here on, result.data is non-null,
// but it is typed as Record<string, string | File>.
const data = result.data;

const name = data["name"];
if (typeof name !== "string") {
	throw new Error("Expected name to be a string");
}
name.toUpperCase();

const age = data["age"];
if (typeof age !== "string") {
	throw new Error("Expected age to be a string");
}
Number(age).toFixed(0);
