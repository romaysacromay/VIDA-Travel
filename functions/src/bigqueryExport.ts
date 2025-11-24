/**
 * VIDA Travel - BigQuery Export Function
 * Scheduled export of Firestore data to BigQuery for analytics
 */

import { onSchedule } from "firebase-functions/v2/scheduler";
import { BigQuery } from "@google-cloud/bigquery";
import * as admin from "firebase-admin";

export const exportToBigQuery = onSchedule("every 6 hours", async (event) => {
  console.log("🔄 Starting BigQuery export...");

  const bigquery = new BigQuery({
    projectId: process.env.BIGQUERY_PROJECT_ID || process.env.GCLOUD_PROJECT,
  });

  const datasetId = process.env.BIGQUERY_DATASET || "vida_analytics";

  try {
    // Ensure dataset exists
    await ensureDatasetExists(bigquery, datasetId);

    // Export each collection
    await exportCollection(
      bigquery,
      datasetId,
      "simulator_sessions",
      "simulator_sessions"
    );
    await exportCollection(
      bigquery,
      datasetId,
      "analytics_events",
      "analytics_events"
    );
    await exportCollection(
      bigquery,
      datasetId,
      "activation_payments",
      "activation_payments"
    );
    await exportCollection(
      bigquery,
      datasetId,
      "meta_pixel_events",
      "meta_pixel_events"
    );
    await exportCollection(
      bigquery,
      datasetId,
      "variant_assignments",
      "variant_assignments"
    );
    await exportCollection(bigquery, datasetId, "chat_logs", "chat_logs");

    console.log("✅ BigQuery export completed successfully");
  } catch (error) {
    console.error("❌ BigQuery export failed:", error);
    throw error;
  }
});

/**
 * Ensure BigQuery dataset exists
 */
async function ensureDatasetExists(
  bigquery: BigQuery,
  datasetId: string
): Promise<void> {
  const [datasets] = await bigquery.getDatasets();
  const datasetExists = datasets.some((d) => d.id === datasetId);

  if (!datasetExists) {
    console.log(`Creating dataset: ${datasetId}`);
    await bigquery.createDataset(datasetId, {
      location: "US",
    });
  }
}

/**
 * Export Firestore collection to BigQuery
 */
async function exportCollection(
  bigquery: BigQuery,
  datasetId: string,
  collectionName: string,
  tableName: string
): Promise<void> {
  console.log(`📊 Exporting ${collectionName} to BigQuery...`);

  const db = admin.firestore();
  const dataset = bigquery.dataset(datasetId);
  const table = dataset.table(tableName);

  // Ensure table exists
  const [tableExists] = await table.exists();
  if (!tableExists) {
    console.log(`Creating table: ${tableName}`);
    await table.create({
      schema: getTableSchema(collectionName),
      timePartitioning: {
        type: "DAY",
        field: "timestamp",
      },
    });
  }

  // Query documents that haven't been exported yet
  const snapshot = await db
    .collection(collectionName)
    .where("exported", "==", false)
    .limit(1000)
    .get();

  if (snapshot.empty) {
    console.log(`No new documents to export from ${collectionName}`);
    return;
  }

  console.log(`Found ${snapshot.size} documents to export from ${collectionName}`);

  // Prepare rows for BigQuery
  const rows = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      insertId: doc.id,
      json: {
        document_id: doc.id,
        ...flattenObject(data),
        exported_at: new Date().toISOString(),
      },
    };
  });

  // Insert into BigQuery
  await table.insert(rows);

  // Mark documents as exported
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.update(doc.ref, { exported: true });
  });
  await batch.commit();

  console.log(
    `✅ Exported ${rows.length} documents from ${collectionName} to BigQuery`
  );
}

/**
 * Get table schema for collection
 */
function getTableSchema(collectionName: string): any {
  const commonFields = [
    { name: "document_id", type: "STRING" },
    { name: "timestamp", type: "TIMESTAMP" },
    { name: "exported_at", type: "TIMESTAMP" },
    { name: "exported", type: "BOOLEAN" },
  ];

  const schemas: { [key: string]: any[] } = {
    simulator_sessions: [
      ...commonFields,
      { name: "session_id", type: "STRING" },
      { name: "variant_id", type: "STRING" },
      { name: "destination", type: "STRING" },
      { name: "adults", type: "INTEGER" },
      { name: "children", type: "INTEGER" },
      { name: "monthly_salary", type: "FLOAT" },
      { name: "weekly_deposit", type: "FLOAT" },
      { name: "package_price", type: "FLOAT" },
      { name: "savings_weeks", type: "INTEGER" },
      { name: "loan_amount", type: "FLOAT" },
      { name: "converted", type: "BOOLEAN" },
      { name: "utm_source", type: "STRING" },
      { name: "utm_campaign", type: "STRING" },
    ],
    analytics_events: [
      ...commonFields,
      { name: "event_type", type: "STRING" },
      { name: "session_id", type: "STRING" },
      { name: "event_data", type: "JSON" },
    ],
    activation_payments: [
      ...commonFields,
      { name: "transaction_id", type: "STRING" },
      { name: "session_id", type: "STRING" },
      { name: "amount", type: "FLOAT" },
      { name: "status", type: "STRING" },
      { name: "payment_method", type: "STRING" },
    ],
    meta_pixel_events: [
      ...commonFields,
      { name: "event_name", type: "STRING" },
      { name: "event_id", type: "STRING" },
      { name: "session_id", type: "STRING" },
      { name: "event_data", type: "JSON" },
    ],
    variant_assignments: [
      ...commonFields,
      { name: "variant_id", type: "STRING" },
      { name: "session_id", type: "STRING" },
      { name: "assigned_at", type: "TIMESTAMP" },
    ],
    chat_logs: [
      ...commonFields,
      { name: "session_id", type: "STRING" },
      { name: "user_message", type: "STRING" },
      { name: "ai_response", type: "STRING" },
    ],
  };

  return { fields: schemas[collectionName] || commonFields };
}

/**
 * Flatten nested object for BigQuery
 */
function flattenObject(obj: any, prefix = ""): any {
  const flattened: any = {};

  for (const key in obj) {
    if (!obj.hasOwnProperty(key)) continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}_${key}` : key;

    // Convert Firestore Timestamp to ISO string
    if (value && typeof value === "object" && value.toDate) {
      flattened[newKey] = value.toDate().toISOString();
    }
    // Flatten nested objects (one level deep only)
    else if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      prefix === ""
    ) {
      Object.assign(flattened, flattenObject(value, newKey));
    }
    // Arrays and other values as-is
    else {
      flattened[newKey] = value;
    }
  }

  return flattened;
}

