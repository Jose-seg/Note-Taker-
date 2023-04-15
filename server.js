// required packages 
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // using this line of code to require the uuid package for each notes generated id

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes for HTML
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// Handling for the API routes
app.get("/api/notes", (req, res) => {
    fs.readFile("db.json", "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});
// this line is for getting all the other routes we didnt call Note: remember to put get("*") after the other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});
// posting the notes that a user saves
app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4(); // each new note will be given a unique id

    fs.readFile("db.json", "utf8", (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
// creates content with in the db.json file
    fs.writeFile("db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;
        res.json(newNote);
    });
  });
});

// Code for the delete route
app.delete("/api/notes/:id", (req, res) => {
    const noteId = req.params.id;

    fs.readFile("db.json", "utf8", (err, data) => {
        if (err) throw err; // if error then throws an error to let you know there's an issue

        let notes = JSON.parse(data);
        notes = notes.filter((note) => note.id !== noteId);

        fs.writeFile("db.json", JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.sendStatus(200); // 200 status ok to ensure everything went well
        });
    });
});
// if our backend is successful then consoled message will appear when npm start is ran
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})