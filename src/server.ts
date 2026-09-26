import express from "express";
import pool from "./db";
import tasksRouter from "./routes/tasks";

const app = express ();

app.use(express.json());
app.use("/tasks", tasksRouter);

pool.query("SELECT NOW()")
.then(() => {
    console.log ("database is connected");
})
.catch((error:unknown) => {
    console.error("failed connection to database", error);
});

app.get ("/", (req, res) => {
    res.send ("API is running");
});
app.listen(3000, () =>{

    console.log("server is listening on port 3000");

})