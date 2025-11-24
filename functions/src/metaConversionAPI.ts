/**
 * VIDA Travel - Meta Conversion API
 * Server-side event tracking for Meta Pixel deduplication
 */

import { onRequest } from "firebase-functions/v2/https";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const metaConversionAPI = onRequest({
  cors: true, // Enable CORS
}, async (request, response) => {
  try {
    // Set CORS headers
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS preflight request
    if (request.method === 'OPTIONS') {
      response.status(204).send('');
      return;
    }
    
    // Only allow POST requests
    if (request.method !== "POST") {
      response.status(405).send("Method Not Allowed");
      return;
    }

    const { eventName, eventId, eventData, userData } = request.body;

    // Validate required fields
    if (!eventName || !eventId) {
      response.status(400).send("Missing required fields: eventName, eventId");
      return;
    }

    // Get Meta credentials from environment (supports both new and legacy config)
    const pixelId = process.env.META_PIXEL_ID || (functions.config().meta?.pixel_id as string);
    const accessToken = process.env.META_ACCESS_TOKEN || (functions.config().meta?.access_token as string);

    if (!pixelId || !accessToken) {
      console.error("❌ Meta Pixel credentials not configured");
      response.status(500).send("Meta Pixel not configured");
      return;
    }

    // Build Conversion API payload
    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          action_source: "website",
          event_source_url: eventData?.page_url || request.headers.referer,
          user_data: {
            client_ip_address:
              request.headers["x-forwarded-for"] || request.ip,
            client_user_agent: request.headers["user-agent"],
            fbc: userData?.fbc,
            fbp: userData?.fbp,
          },
          custom_data: {
            value: eventData?.value || 0,
            currency: eventData?.currency || "MXN",
            content_name: eventData?.content_name,
            content_ids: eventData?.content_ids,
            content_type: eventData?.content_type,
          },
        },
      ],
    };

    // Send to Meta Conversion API
    const apiUrl = `https://graph.facebook.com/v18.0/${pixelId}/events`;
    const apiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        access_token: accessToken,
      }),
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("❌ Meta Conversion API error:", errorText);
      throw new Error(`Meta API request failed: ${errorText}`);
    }

    const result = await apiResponse.json();
    console.log("✅ Meta Conversion API success:", eventName, eventId);

    // Log to Firestore
    try {
      await admin.firestore().collection("meta_conversions_api").add({
        event_name: eventName,
        event_id: eventId,
        event_data: eventData,
        api_response: result,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (logError) {
      console.error("Failed to log conversion:", logError);
    }

    response.json({
      success: true,
      eventId,
      message: "Event sent to Meta Conversion API",
    });
  } catch (error: any) {
    console.error("❌ Meta Conversion API error:", error);
    response.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

