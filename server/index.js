const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

// creating an API endpoint
// routes are defined via app.HTTP_METHOD() (such as get, post, put, delete)
//      path    callback function (what happens when the request is called)
app.get("/api", (req, res) => {
    // request object: contains details like the HTTP method, headers, and request body
    // response object: defines the information that we want to send, contains different methods of sending a response to the client
    // such as res.send(), res.json(), res.render()
    res.json({message : "Hello from server!"})
});

app.post("/events", (req, res) => {
    res.send("POST Request called");
});

// when server is started on the port -> app logs this message to the console
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});