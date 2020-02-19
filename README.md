# Employee Tracker

This is an app enables a company to organize and budget employees and departments with simplicity.

Check out the repo [here](https://github.com/agtravis/employee-tracker).

This app runs in Node.JS - see [Setup](#setup) below for instructions on how to run

## Table of contents

- [General info](#general-info)
- [Screenshots](#screenshots)
- [Technologies](#technologies)
- [Code Examples](#code-examples)
- [Setup](#setup)
- [Features](#features)
- [Status](#status)
- [Contact](#contact)

## General info

This app uses SQL (Structured Query Language) queries within JavaScript running in Node.JS to interact with relational tables within a database in order to enable a company's administrator to easily manage a workforce. It is written with simplicity in mind, and many of the SQL queries are developed to ensure a seamless flow for the user - for example: When wishing to view a team being led by a manager the user selects the manager. In order to remove the prospect of an employee being selected who is not a manager (and therefore not returning any information), only employees who have other employees assigned to them (using a `foreign key` constraint) will be appear in the selection list.

## Screenshots

![Landing Page](./assets/images/start.PNG)

This is what the user sees when they first run the app.

![View All Employees](./assets/images/view-all-employees.PNG)

A screen shot of when the user chooses to see all employees.

## Technologies

This package was written in JavaScript using Node.js, and is based around the npm package `Express`. If the GitHub repo is forked, in order to edit the code the user can run `npm i` to install this dependency.

The entry point for this app is `server.js`. On load, this file requires the modules for `express`, `fs`, and `path`, calls `express` into the variable `app`, and then sets the URL encoding and json features using `app.use`.

Next some routes are defined. Since the front end was created by someone other than myself and I wrote the back end to align with it, I set a route to align with each of the `CSS` and `JavaScript` external files.

There are only 2 routes that deliver `get` responses that respond with a webpage, the main (`/`) and the atual app renders the functions at the route `/notes`. There is also a route that handles everything else that might be entered to direct the user to a `404 not found` page.

There are then 3 different routes for interacting with the API, these will be detailed in the Code Examples below.

Finally, the app listens to a port which is defined as `process.env.PORT` so that it can upload to Heroku.

## Code Examples

'GET':

    app.get('/api/notes', (req, res) => {
        let notes = '';
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (err) throw err;
            notes = JSON.parse(data);
            for (let i = 0; i < notes.length; ++i) {
                if (!notes[i].id) {
                    notes[i].id = notes[i].title.replace(/ +/g, '-');
                }
                for (let j = i + 1; j < notes.length; ++j) {
                    if (notes[i].id === notes[j].id) {
                        notes[j].id += '-x';
                    }
                }
            }
            fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
                if (err) throw err;
            });
            res.json(notes);
        });
    });

This route first establishes an empty variable to be an empty string. Next it reads the JSON file and writes the content into the variable as a JSON object. If a nested object of the JSON object does not contain a specific property 'id', it is assigned based on the text contained in the title. Later in the code, this id is going to be passed in the URL, so a `replace` method is run on the text (using `regex`) to ensure that all space characters are replaced with a hyphen. It also accounts for if the user has two notes with the same title, but different descriptions. This is then written as a new file that overwrites the existing file, and then the HTML file is sent to the browser - The HTML file has JavaScript that calls the API to populate the page with the notes being 'stored' in the JSON file (the JSON file is acting as a pseudo-database).

'POST':

    app.post('/api/notes', (req, res) => {
        const newNote = req.body;
        let notes = '';
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (err) throw err;
            notes = JSON.parse(data);
            notes.push(newNote);
            for (let i = 0; i < notes.length; ++i) {
                if (!notes[i].id) {
                    notes[i].id = notes[i].title.replace(/ +/g, '-');
                }
                for (let j = i + 1; j < notes.length; ++j) {
                    if (notes[i].id === notes[j].id) {
                        notes[j].id += '-x';
                    }
                }
            }
            fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
                if (err) throw err;
            });
        });
        res.sendFile(path.join(__dirname, 'notes.html'));
    });

The POST request routing is almost the same as the GET. This is because it is still reading the file and writing the file, but in between these two `fs` functions, it is inserting a new object passed to it from the AJAX POST request.

'DELETE':

    app.delete('/api/notes/:id', (req, res) => {
        const item = req.params.id;
        let notes = '';
        fs.readFile('./db.json', 'utf8', (err, data) => {
            if (err) throw err;
            notes = JSON.parse(data);
            for (const note of notes) {
                if (note.id === item) {
                    notes.splice(notes.indexOf(note), 1);
                }
            }
            fs.writeFile('./db.json', JSON.stringify(notes), 'utf8', err => {
                if (err) throw err;
            });
        });
        res.sendFile(path.join(__dirname, 'notes.html'));
    });

In the routing for the DELETE request, a parameter is sent back to the handling. This is the variable that is used to make sure the correct object from the JSON response is deleted, before the file is written again. Since this is taken from the object storing the content that the HTML is displaying, I have written the code to ensure that the property value is in a format that can be passed through the URL.

Once the data has been accessed, a `for...of` loop runs on it which checks each object to see if the id property matches the id that has been passed. Once that has been matched, it is removed from the array, and the document is rewritten and then passed to the browser.

Here is the JavaScript (actually jQuery) for deleting a note (condensed for relevance):

    const handleNoteDelete = function(event) {
        event.stopPropagation();
        const note = $(this).parent('.list-group-item').data();
        //JavaScript functions
        deleteNote(note.id).then(function() {
            //code to render HTML
        });
    };

This code block shows that when a user clicks on the delete icon, the data attached to the parent node of that icon is passed as a variable to the `deleteNote` function, which...:

    const deleteNote = function(id) {
        return $.ajax({
            url: 'api/notes/' + id,
            method: 'DELETE'
        });
    };

...can be seen in this AJAX request. The property `id` is sent via the URL back to the route where it is handled as a wildcard. Again, since it is passed through the URL, we can see it needs to be a string with the same rules that apply to a URL, hence using a `replace` method (here with regex) to remove any space characters.

## Setup

Nothing is stored on the user's device, so they will see the same list however they access the app. To use it they simply visit the URL https://agtravis-note-taker.herokuapp.com/. There are some pre-coded events written purely to give the list examples to populate with. The user can easily delete these.... Alternatively they can make plans to match the notes, whatever they like.

## Features

This app features a nice UI, simple design and easy operation.

## Status

This app presently only works for one individual. For different users to utilize the app, each user would have to fork the repository and deploy their own version of the app. In order to make this marketable, it would at a minimum have to implement some sort of user log-in or authentication process (for example accessing the user's IP address, or accessing sign in credentials with Google sign in).

Additionally, this app doesn't actually interact with a database. As mentioned before, it is a pseudo-database, in that it is a JSON document that is rewritten each time anything changes with a POST or DELETE request. The downside to this is it has no durability - if the server goes down or resets, the updated JSON file (all the user's saved notes) will be lost and will revert back to the version most recently push via GitHub.

This app also does not have the ability to update existing notes (PUT request). In order to initiate this, the HTML and JavaScript files would need to be updated.

### Future Developement

This has mostly been touched on in the _Status_ section, however the next step would be to make notes editable. Without implementing a PUT request, if clicking on the note brought up an editable text (currently it is an element rather than an input), then it could be edited, and a save could be programmed to _overwrite_ the existing note (this would most likely actually simply simultaneously delete the previous note and write a brand new note) to 'update' it. However this would just be using GET, POST, and DELETE, just all at the same time.

## Contact

Created by [@agtravis](https://agtravis.github.io/)
