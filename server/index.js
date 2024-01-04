const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// creating an API endpoint
app.get("/api", (req, res) => {
    res.json({message : "Hello from server!"})
});

app.post("/", (req, res) => {
    res.send("POST Request called");
});

// when server is started on the port -> app logs this message to the console
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});