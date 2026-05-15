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

    // 1. Ensure column exists
    await client.query("ALTER TABLE event ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT TRUE");
    console.log("Checked/Added visible column");

    // 2. Set all to true
    const res = await client.query("UPDATE event SET visible = TRUE");
    console.log(`Updated ${res.rowCount} events to visible=true`);

    // 3. Verify
    const verify = await client.query("SELECT id, title, visible FROM event LIMIT 5");
    console.log("Current state:", verify.rows);

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
