document.addEventListener("DOMContentLoaded", function() {
    const startWebcamButton = document.getElementById("startWebcam");
    const saveDrawingButton = document.getElementById("saveDrawing");
    const canvas = document.getElementById("drawingCanvas");
    const ctx = canvas.getContext("2d");
    const colorPicker = document.getElementById("colorPicker");
    const brushSize = document.getElementById("brushSize");
    const eraser = document.getElementById("eraser");
    const clearCanvas = document.getElementById("clearCanvas");
    const undoButton = document.getElementById("undo");
    const redoButton = document.getElementById("redo");
    const toolbarButton = document.getElementById("toolbarButton");
    const toolbar = document.querySelector(".toolbar");

    let history = [];
    let redoStack = [];

    canvas.width = 800;
    canvas.height = 400;

    startWebcamButton.addEventListener("click", async function () {
        const dataToSend = { click: true };

        try {
            const response = await fetch("/run-function", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataToSend),
            });

        } catch (error) {
            console.error("Error:", error);
        }
    });

    function saveState() {
        history.push(canvas.toDataURL());
        redoStack = [];
    }

    clearCanvas.addEventListener("click", () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        saveState();
    });
    
    undoButton.addEventListener("click", () => {
        if (history.length > 0) {
            redoStack.push(history.pop());
            let img = new Image();
            img.src = history[history.length - 1] || "";
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
        }
    });

    redoButton.addEventListener("click", () => {
        if (redoStack.length > 0) {
            let img = new Image();
            img.src = redoStack.pop();
            img.onload = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            };
            history.push(img.src);
        }
    });

    eraser.addEventListener("click", () => {
        ctx.strokeStyle = "#ffffff";
    });

    colorPicker.addEventListener("input", (e) => {
        ctx.strokeStyle = e.target.value;
    });

    brushSize.addEventListener("input", (e) => {
        ctx.lineWidth = e.target.value;
    });

    saveDrawingButton.addEventListener("click", () => {
        let link = document.createElement("a");
        link.download = "drawing.png";
        link.href = canvas.toDataURL();
        link.click();
    });

    toolbarButton.addEventListener("click", () => {
        toolbar.style.display = toolbar.style.display === "flex" ? "none" : "flex";
    });

    saveState();
    let serverData = { num1: 0, num2: 0 , num3:0 , num4:0};

    async function fetchData() {
        try {
            const response = await fetch("/api/data");
            serverData = await response.json();
            console.log("Updated data: index: ("+serverData["num1"]+","+serverData["num2"]+") ,middle: ("+serverData["num3"]+","+serverData["num4"]+")");
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    setInterval(fetchData, 0);
});
