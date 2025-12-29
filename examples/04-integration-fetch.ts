import { parse } from "#safe-formdata";

/**
 * Integration example with Fetch / Request
 * - how to use safe-formdata in a real request handler
 * - parse FormData from Request
 * - handle missing / invalid fields
 */

async function handleRequest(request: Request) {
  // Parse incoming FormData
  const formData = await request.formData();

  const result = parse(formData);

  if (result.data === null) {
    // Validation failed
    console.error("Validation issues:", result.issues);
    return new Response("Invalid FormData", { status: 400 });
  }

  // result.data is non-null here
  const data = result.data;

  // Example: retrieve 'username' field safely
  if (!("username" in data)) {
    return new Response("Username is required", { status: 400 });
  }

  const username = data["username"];
  if (typeof username !== "string") {
    return new Response("Username must be a string", { status: 400 });
  }

  // Proceed with valid data
  return new Response(`Hello, ${username.toUpperCase()}`, { status: 200 });
}

// Dummy call to satisfy lint / tsc
void handleRequest(new Request("https://example.com"));
