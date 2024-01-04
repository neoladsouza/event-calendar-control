const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

let sentEvents;

// creating an API endpoint
app.get("/api", (request, response) => {
    response.json({message: "among us"});
});

app.post("/events", (request, response) => {
    // response.json("POST Request called");
    response.send(request.body);
});

// when server is started on the port -> app logs this message to the console
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});