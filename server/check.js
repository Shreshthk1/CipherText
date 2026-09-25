// check.js  (put this in server/, next to migrate.js)
const  pool = require  ("./Controllers/db.js");


async function main() {
  const result = await pool.query("SELECT id, username, created_at FROM users");
  console.log(result.rows);
  await pool.end();
}

main();