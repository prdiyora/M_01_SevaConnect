const { Client } = require('pg');

const client = new Client({
  user: 'neondb_owner',
  password: 'npg_3HUb0dfuSvOW',
  host: '52.72.123.251',
  port: 5432,
  database: 'eventdb',
  ssl: {
    rejectUnauthorized: false
  },
  options: "project=ep-empty-surf-aq7i5mam"
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Neon DB");

    // 1. Fetch all columns and data
    const verify = await client.query("SELECT * FROM event");
    console.log("Full data:", JSON.stringify(verify.rows, null, 2));

    // 2. Check column types
    const columns = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'event'");
    console.log("Column types:", columns.rows);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
