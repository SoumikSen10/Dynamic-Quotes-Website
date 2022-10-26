const express = require('express')
const path = require('path');
const app = express();
const requests = require('requests');
const PORT = 3000;
const hbs = require('hbs');
/*Handlebars.js is a templating engine similar to the ejs module in node.js, but more powerful and simple to use. It ensures minimum templating and is a logicless engine that keeps the view and the code separated. It can be used with express as the hbs module, available through npm. HandleBars can be used to render web pages to the client side from data on the server-side.
Command to install hbs module:

npm i hbs
To use handlebars in express, we need to store HTML code into a .hbs extension in the ‘views’ folder in the source directory as hbs looks for the pages in the views folder.
*/

const templatePath = path.join(__dirname, "/templates/views");
const partialsPath = path.join(__dirname, "/templates/partials");
//to set the view engine
app.set('view engine', "hbs");

//to only way to change the name of views folder which is in no other way possible.Changed forcefully.
//Basically the app.set automatically sets the name of templates folder to views while running . So indirectly we kept the name views only

app.set("views", templatePath);

hbs.registerPartials(partialsPath);
const static_path = path.join(__dirname, "./public")
app.use(express.static(static_path));

//template engine root
app.get("/", (req, res) => {
    res.render("index");
})

app.get("/about", (req, res) => {
    requests(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&appid=474c80327b1cf9f2195e67bffdb3167d`)
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const strData = JSON.stringify(objData)
                /*const arrData = [strData]
                const realTimeData = JSON.stringify(arrData.map((val) =>
                        replaceVal(homeFile, val))
                    .join(""))
                res.writeHead(200, { 'Content-Type': 'text/html' }) */
            const arrData = [strData];
            /* const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(""); */
            console.log(`City Name is : ${arrData[0].name}`);
            res.write(arrData[0].name);
        })
        .on("end", (error) => {
            if (error) return console.log('Connection lost due to errors', error)
            res.end();
        });
});

/*  //loaded when user enters anything wrong after asking for the about us page 
app.get("/about/*", (req, res) => {
        res.send("Oops this about us page couldnot be found!");
    }) */
//here * means it checks whether the user has entered any root other than the ones gives above  
app.get("*", (req, res) => {
    res.render("error");
})

/* const static_path = path.join(__dirname, "./public");
//built-in middleware
app.use(express.static(static_path)); */

app.listen(PORT, () => {
    console.log(`Listening at PORT ${PORT}`);
})