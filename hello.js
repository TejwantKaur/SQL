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
            if(formPass != user.password){
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
        
    } catch(err){
        console.log(err);
        res.send("Some error in database");
    }
});