const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");


app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

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
});

app.get("/users", (req, res)=>{
    let q = `SELECT * FROM user`;
    try{
        connection.query(q, (err, users)=>{
            if(err) throw (err);
            res.render("showusers.ejs", {users});
        })
    }catch (err){
        console.log(err);
        res.send("Some error in DataBase");
    }
});

app.get("/user/:id/edit", (req,res)=>{
    let {id} = req.params;
    console.log(id);

    let q = `SELECT * FROM user WHERE id = "${id}"`; 
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            res.render("edit.ejs", {user});
        });
    }catch(err){
        console.log(err);
        res.send("Some error in database");
    }
});

app.patch("/user/:id",(req,res)=>{
    let {id} = req.params;
    let {password: formPass, username: newUsername} = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result[0];
            if(formPass!= user.password){
                res.send("Wrong Password");
            }
            else{
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id = '${id}'`;
                connection.query(q2, (err, result)=>{
                    if(err) throw err;
                    res.redirect("/users");
                });
            }
        });
        
    }catch(err){
        console.log(err);
        res.send("Some error in database");
    }
});

app.get("/users/new", (req, res)=>{
    res.render("new.ejs");
});

app.post("/users", (req,res)=>{
    console.log(req.body);
    // res.send("post req working")
    
    let { username, email, password } = req.body;
    let id = uuidv4();
    let q = `INSERT INTO User (id, username, email, password) values ('${id}', '${username}', '${email}', '${password}') `;
    
    try{  
        connection.query(q, (err, result)=>{
            if (err) throw err;
            console.log(result);
            // req.send("done");
            res.redirect("/users");
        });
    } catch (err){
        console.log(err);
    };
});

app.get("/users/:id/delete", (req,res)=>{
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id = "${id}"`; 
    
    try{
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            res.render("delete.ejs", { user });  
        });
    } catch (err) {
        console.log(err);
        res.send("Some error in database");
    }
});

app.delete("/users/:id", (req,res) => {
    // res.send("Successfull");
    console.log("success");
    let { id } = req.params;
    let { password : formPass } = req.body;
    let q = `SELECT * FROM user WHERE id = "${id}"`;

    try {
        connection.query(q, (err, result)=>{
            if (err) throw err;
            let user = result[0];
            
            if(formPass != user.password){
                res.send("Wrong Password")
            } else {
                let q2 = `DELETE FROM user WHERE id = "${id}"`;
                connection.query(q2, (err, result)=>{
                    if (err) throw err;
                    res.redirect("/users");
                });
            }
        });
    } catch (err){
        res.send("Some error in database");
    }
});

app.listen("8080", ()=>{
    console.log("Server Started at port 8080");
});




























// let user = [id, username, email, password];
    // let user = [
    //     ["1245","123_userc", "123@abcd", "abcfc"],
    //     ["1223y","123_userg", "123@abcg", "abcfg"]
    // ];


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