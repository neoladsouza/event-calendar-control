const express = require("express");
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

let counter = 0;

// creating an API endpoint
app.get("/api", (request, response) => {
    response.json({message: "among us"});
});

/* 
    React's Strict Mode intentionally invokes components twice in development to help identify side effects. 
    If you're running your application in development mode with Strict Mode enabled, 
    you will observe double renders for diagnostic purposes.
*/
app.post("/events", (request, response) => {
    const receivedData = request.body;
    
    console.log("Received data: ", receivedData);

    response.json({
        message: 'Data received successfully!',
        request_count: counter
    });
    counter++;
    // response.json(JSON.stringify(request));
    // console.log(response);
    // response.send(request.body);
});

// when server is started on the port -> app logs this message to the console
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});