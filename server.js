const spawner = require('child_process').spawn;

function copy(arr){
    let ans=[];
    let i=0;
     arr.forEach(e => {
        ans.push(e);
    });
    return ans;
}
let arr=[];

const python_process = spawner('python', ['./main.py', JSON.stringify([0])]);
python_process.stdout.on('data',(data) =>{

    data=(data+"").split(',');
    arr=copy(data);
});

const express = require("express");
const app = express();
const PORT = 3000;

app.get("/api/data", (req, res) => {
    const data = { num1: arr[0], num2: arr[1], num3:arr[2] , num4:arr[3] };
    res.json(data);
});

app.use(express.static("public"));

app.post("/run-function", (req) => {
    console.log("Received from frontend:", req.body);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));