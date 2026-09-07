const WEBHOOKS = {
  "ai-bootcamp": "https://api.trustsolar.in/webhook/ai-bootcamp",
  "sfdc-master-class": "https://api.trustsolar.in/webhook/sfdc-master-class"
};

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { Allow: "POST" },
      body: "Method Not Allowed"
    };
  }

  try {
    // Safely parse incoming payload
    const bodyData = JSON.parse(event.body || "{}");

    // Extract formType or default to 'ai-bootcamp'
    const formType = bodyData.formType || "ai-bootcamp";
    const targetWebhook = WEBHOOKS[formType];

    // If an invalid formType is supplied
    if (!targetWebhook) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: `Invalid formType: '${formType}'` })
      };
    }

    // Forward payload to selected webhook
    const response = await fetch(targetWebhook, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
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
