const sqlite3 = require("sqlite3").verbose()

const db = new sqlite3.Database("./database.db",(err)=>{
    if (err){
        console.log(`error : ${err.message}`)
    }else{
        console.log("database connected")
    }
})

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS users(
        username TEXT NOT NULL,
        password TEXT NOT NULL
        )`)
})

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS products(
        title TEXT NOT NULL,
        brand TEXT NOT NULL,
        price INTEGER,
        id INTEGER,
        image_url TEXT NOT NULL,
        rating TEXT NOT NULL
        )`)
})

db.serialize(()=>{
    db.run(`
        CREATE TABLE IF NOT EXISTS productsList(
        id INTEGER,
        title TEXT,
        description TEXT,
        category TEXT,
        price REAL,
        rating INTEGER,
        stock INTEGER,
        brand TEXT,
        availabilityStatus TEXT,
        thumbnail TEXT
        )`)
})


module.exports=db