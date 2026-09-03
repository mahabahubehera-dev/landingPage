const WEBHOOK_URL = "https://api.trustsolar.in/webhook/ai-bootcamp";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: event.body || "{}"
    });

    if (!response.ok) {
      return {
        statusCode: 502,
        body: "The enrollment workflow could not save the submission."
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true })
    };
  } catch (error) {
    console.error("Enrollment forwarding error:", error);
    return {
      statusCode: 502,
      body: "The enrollment workflow is unavailable."
    };
  }
};
