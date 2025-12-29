import { parse } from "#safe-formdata";

/**
 * Field presence example
 * - fields may or may not exist
 * - there is no "optional" field
 * - presence must be checked explicitly
 */

const formData = new FormData();

// Simulate a partially filled form
formData.set("username", "alice");

const result = parse(formData);

if (result.data === null) {
  console.error(result.issues);
  throw new Error("Invalid FormData");
}

// result.data is non-null,
// but keys are not guaranteed to exist.
const data = result.data;

// Check field presence explicitly
if (!("email" in data)) {
  // The field was not sent at all
  console.log("email was not provided");
} else {
  const email = data["email"];

  // Even if present, the type is still string | File
  if (typeof email !== "string") {
    throw new Error("Expected email to be a string");
  }

  email.toLowerCase();
}

// username is present
const username = data["username"];
if (typeof username !== "string") {
  throw new Error("Expected username to be a string");
}

username.toUpperCase();
