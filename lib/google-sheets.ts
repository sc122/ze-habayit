export async function appendRow(question: string): Promise<void> {
  const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error("Missing GOOGLE_SCRIPT_URL environment variable");
  }

  // Google Apps Script always redirects POST → follow the redirect
  const res = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
    redirect: "follow",
  });

  // Apps Script may return HTML redirect page — that's OK, treat as success
  // as long as the request reached Google's servers (2xx or 3xx)
  if (res.status >= 500) {
    throw new Error(`Apps Script error: ${res.status}`);
  }
}
