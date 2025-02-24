const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const app = express();
app.use(express.json({ limit: "10mb" })); 
app.use(express.static("public"));

app.use(express.json({ limit: "5mb" }));
const pythonProcess = spawn("python", ["main.py"]);
let arr="";
pythonProcess.stdout.on("data", (data) => {
   arr=data.toString();
   console.log("Server: " + data.toString())
});
app.post("/frame", (req, res) => {
    if (req.body.image) {
        pythonProcess.stdin.write(req.body.image + "\n");
    }
    res.json({ status: "received" });
});
app.get("/coordinates",(req,res) => {
        res.status(201).json({ data: arr});
})
pythonProcess.stderr.on("data", (data) => console.error("Python Error:", data.toString()));

app.listen(8000, () => console.log("Server running on port http://localhost:8000/"));