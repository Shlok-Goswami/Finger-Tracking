import { Cursor } from "./classFile.js";



const video = document.createElement("video");
video.autoplay = true;
const constraints={ 
    video: { width:640 , height:480 } 
};
const canvas2= document.getElementById("drawingCanvas");
const ctx2 = canvas2.getContext("2d");
canvas2.height=constraints["video"].height;
canvas2.width=constraints["video"].width;
const cursorElement=document.getElementById("svg-container");
const cursor=new Cursor();

function setCursorElement(x,y){
    cursorElement.style.top=y+"px";
    cursorElement.style.left=x+"px";
}
const Icons=[];

fetch("icons/cursor0.svg")
.then(response => response.text())
.then(data => {
   Icons[0]=data;
   
}).catch(error => console.error("Error loading SVG:", error));
fetch("icons/brush.svg")
.then(response => response.text())
.then(data => {
    Icons[1] = data;
})
.catch(error => console.error("Error loading SVG:", error));



function setcursorIcon(){
    if(cursor.mode=="move"){
        cursorElement.innerHTML = Icons[0];
    }
    else if(cursor.mode=="select"){
        cursorElement.innerHTML="";
        cursorElement.innerHTML = Icons[1];
    }
}

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    video.srcObject = stream;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
   
    
    let lastSent = Date.now();
    function sendFrame() {
        if (Date.now() - lastSent < 35) {
            requestAnimationFrame(sendFrame);
            return;
        }
        lastSent = Date.now();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();
        
        canvas.toBlob((blob) => {
            if(!blob){return;}
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                fetch("http://localhost:8000/frame", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: reader.result }),
                });
            };
        }, "image/jpeg");

        requestAnimationFrame(sendFrame);
    }
    sendFrame();
});


function fetchData() {
    fetch("http://localhost:8000/coordinates")
        .then((res) => res.json())
        .then((data) => {
            console.log("Javascript Console: " + data.data);
            let arr= data.data.split(",");
            cursor.setCoordinates(arr[0],arr[1]);
            setCursorElement(cursor.x,cursor.y);
            let x=arr[2];
            let y=arr[3];
            cursor.setMode(x,y);
            setcursorIcon();
        })
        .catch((error) => {
            console.log(" JavaScript catch: " + error);
        });
}
setInterval(fetchData,100)
