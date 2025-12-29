import { parse } from "#safe-formdata";

/**
 * File upload example
 * - handling File values from FormData
 * - explicit type narrowing with instanceof File
 * - size and type checks
 */

const formData = new FormData();

// In real usage, this usually comes from a multipart/form-data request
formData.set(
  "avatar",
  new File(["dummy image data"], "avatar.png", {
    type: "image/png",
  }),
);

const result = parse(formData);

if (result.data === null) {
  // Validation failed
  console.error(result.issues);
  throw new Error("Invalid FormData");
}

// From here on, result.data is non-null,
// but values are still typed as string | File.
const data = result.data;

// avatar: string | File
const avatar = data["avatar"];

// Narrow to File before accessing file-specific properties
if (!(avatar instanceof File)) {
  throw new Error("Expected avatar to be a File");
}

// File-specific checks
const maxSizeInBytes = 2 * 1024 * 1024; // 2MB

if (avatar.size > maxSizeInBytes) {
  throw new Error("File is too large");
}

if (avatar.type !== "image/png") {
  throw new Error("Unsupported file type");
}

// Safe to use as File here
