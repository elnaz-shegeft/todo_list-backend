import { Pool } from "pg";
const pool = new Pool ({
user: "el",
host: "localhost",
database: "todo_list",
password: "jooje_toosi",
port: 5432,
});
export default pool; 