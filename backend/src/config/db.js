import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "gondola.proxy.rlwy.net",
  port: 14982,
  user: "root",
  password: "ErCbzaqJOHOHfZqwpvZVxSjNeQbRvgPo",
  database: "railway",
  ssl: {
    rejectUnauthorized: false,
  },
});