export async function handler(event, context) {
  // This function is no longer in use and has been deprecated.
  return {
    statusCode: 410, // Gone
    body: JSON.stringify({ error: "This AI function is deprecated and no longer in use." }),
  };
}
