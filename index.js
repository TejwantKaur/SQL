const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");

app.set ("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"))
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'deltaApp',
    password: "tej@123"
});

let getRandomUser = () => {
    return [
        faker.string.uuid(),
        faker.internet.userName(),
        faker.internet.email(),
        faker.internet.password(),
    ];
};

app.get("/", (req, res)=>{
    // res.send("Welcome to home page");

    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q, (err, result)=>{
            // result is basicalyy the result we get from query q
            if(err) throw (err);
            console.log(result[0]["count(*)"]);
            
            let count = result[0]["count(*)"];
            res.render("home.ejs", {count});
        });
    } catch (err){
        console.log(err);
        res.send("Some error in DataBase");
    }
})

app.listen("8080", ()=>{
    console.log("Server Started at port 8080");
})










// let q = "INSERT INTO user(id, username, email, password) VALUES?";
// let data = [];

// for(let i=1; i<=100; i++){
//     data.push(getRandomUser());
// }

// try{
//     connection.query(q,[data], (err, result) =>{
//         if (err) throw err;
//         console.log(result);
//     });
// }catch(err){
//     console.log(err);
// };

// connection.end();

// let getRandomUser = () => {
//     return {
//         userId: faker.string.uuid(),
//         username: faker.internet.userName(),
//         email: faker.internet.email(),
//         password: faker.internet.password(),
//     };
// }

// console.log(getRandomUser());