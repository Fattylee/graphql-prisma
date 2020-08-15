const { Pool } = require("pg");
const pool = new Pool({
  user: "fattylee",
  password: "fattylee",
  port: 5433,
  host: "127.0.0.1",
});
pool
  .query("select 1+1")
  .then((res) => {
    console.log("result:", res);
  })
  .catch(console.log);
console.log("last");
