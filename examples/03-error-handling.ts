import { parse } from "#safe-formdata";

/**
 * Error handling example
 * - how to inspect validation issues
 * - data is null when validation fails
 * - duplicated keys are rejected
 */

const formData = new FormData();

// This intentionally creates an invalid FormData.
// safe-formdata does NOT allow duplicated keys.
formData.append("role", "admin");
formData.append("role", "user");

const result = parse(formData);

if (result.data !== null) {
	// This should never happen in this example
	throw new Error("Expected validation to fail");
}

// data is null when validation fails
console.log("Validation failed");

// issues contains detailed information about what went wrong
for (const issue of result.issues) {
	// Issues are structured data.
	// Interpret or format them at a higher layer if needed.
	console.error({
		code: issue.code,
		path: issue.path,
		key: issue.key,
	});
}

// Typical handling pattern:
// - log issues
// - return HTTP 400
// - show a validation error to the user
throw new Error("Invalid FormData");
