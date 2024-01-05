const express = require("express");
const bodyParser = require('body-parser');
const fileSystem = require('fs');
const PORT = process.env.PORT || 3001;
const app = express();
app.use(bodyParser.json());

let counter = 0;
const eventDataJSONFilePath = "C:/Users/harol/OneDrive/Documents/GitHub/form-app/server/data.json";
let isDataPosted = false;

// creating an API endpoint
app.get("/api", (request, response) => {
    response.json({message: "among us"});
});

/* 
    React's Strict Mode intentionally invokes components twice in development to help identify side effects. 
    If you're running your application in development mode with Strict Mode enabled, 
    you will observe double renders for diagnostic purposes.
*/
app.get("/events", (request, response) => {
    response.json() = readJSONFile(eventDataJSONFilePath);
});


app.post("/events", (request, response) => {
    const receivedData = request.body;
    console.log("Received data: ", receivedData);
    writeToJSONFile(eventDataJSONFilePath, JSON.stringify(receivedData, null, "\t"));

    response.json({
        message: 'Data received successfully!',
        request_count: counter
    });
    counter++;
    isDataPosted = true;
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
    writeToJSONFile(eventDataJSONFilePath, JSON.stringify([], null, "\t"));
});

// writing json string to file
function writeToJSONFile(path, jsonString) {
    fileSystem.writeFile(path, jsonString, (error) => {
        if (error) {
            console.log("error writing file :(", error);
        } else {
            console.log("file written successfully!");
        }
    })
}

// reading json file and parsing to JS object
function readJSONFile(path) {
    fileSystem.readFile(path, "utf8", (error, data) => {
        if (error) {
            console.log("error reading file :(", error);
        } else {
            const jsonData = JSON.parse(data);
            console.log("Parsed JSON data: ", jsonData);
            return jsonData;
        }
    })
}