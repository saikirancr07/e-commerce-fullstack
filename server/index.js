const express=require("express")
const cors = require("cors")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const db = require("./db")

const app = express()
app.use(express.json())
app.use(cors())

app.post("/register",(req,res)=>{
    const {username,password} = req.body
    const query=`SELECT * FROM users WHERE username=?`
    db.get(query,[username],async (err,row)=>{
        if (row) {
            return res.status(400).json({
                error_msg : "user already exists"
            })

        }
        const hashedPassword=await bcrypt.hash(password , 10)
        console.log(hashedPassword)
        const query1 = `INSERT INTO users (username, password) VALUES (?, ?)`
        db.run(query1,[username,hashedPassword],(err)=>{
            if (err){
                return res.status(400).json({
                    error_msg : err.message
                })
            }
            res.status(200).json({message:"inserted success"})
        })
    })
})

app.post("/login",(req,res)=>{
    const {username,password} = req.body
    const query=`SELECT * FROM users WHERE username=?`
    db.get(query,[username],async (err,row)=>{
        if (!row){
            return res.status(400).json({
                error_msg : "user is not register"
            })
        }
        const isMatch=await bcrypt.compare(password, row.password)
        if (!isMatch){
            return res.status(400).json({
                error_msg : "password is invalid"
            })
        }
        const payload={username}
        const token = jwt.sign(payload,"saikiran")
        res.status(200).json({
            message : "login succesfylly",
            jwt_token : token
        })
        
    })
})

app.post("/products",(req,res)=>{
    const {title,brand,id,rating,image_url,price} = req.body
    console.log(title)
    if (!title || !brand || !id || !rating || !image_url || !price){
        console.log("all fields required")
    }
    const query = `INSERT INTO products (title,brand,price,id,image_url,rating) values (?, ?, ?, ?, ?, ?)`
    db.run(query,[title,brand,price,id,image_url,rating],(err)=>{
        if (err){
            console.log("error")
            return res.status(500).json({
                error : err.message
            })
        }
        res.status(200).json({
            message : "product inserted successfully"
        })
    })
})

app.post("/products/bulk",(req,res)=>{
    const products=req.body.products
    const productData=products.map(()=>"(?, ?, ?, ?, ?, ?)").join(",")
    const values = products.flatMap(p=>[p.title, p.brand, p.price, p.id, p.image_url, p.rating])
    const query = `INSERT INTO products (title,brand,price,id,image_url,rating) values ${productData}`
    db.run(query,values,function(err){
        if (err){
            return res.status(400).json({
                error : err.message
            })
        }
        res.status(200).json({
            inserted : this.changes,
            message : "success"
        })
    })
})

app.post("/productsList/bulk",(req,res)=>{
    const products=req.body.products
    const productData=products.map(()=>"(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(",")
    const values = products.flatMap(p=>[p.id, p.title, p.description, p.category, p.price, p.rating, p.stock, p.brand, p.availabilityStatus, p.images[0]])
    const query = `INSERT INTO productsList (id,title,description,category,price,rating,stock,brand,availabilityStatus,thumbnail) VALUES ${productData}`
    db.run(query,values,function(err){
        if (err){
            return res.status(400).json({
                error : err.message
            })
        }
        res.status(200).json({
            inserted : this.changes,
            message : "success"
        })
    })
})

// app.get("/productsList",(req,res)=>{
//     const query = `SELECT * FROM productsList`
//     db.all(query,[],(err,rows)=>{
//         if (err){
//             res.status(400).json({
//                 error_msg : err.message
//             })
//         }
//         res.status(200).json({
//             products : rows
//         })
//     })
// })

app.delete("/productsList",(req,res)=>{
    const query = `DELETE FROM productsList`
    db.run(query,[],(err)=>{
        if (err){
            return res.status(400).json({
                error_msg : "failed to delete all products"
            })
        }
        res.status(200).json({
            message : "all products delete successfully"
        })
    })
})

app.get("/products",(req,res)=>{
    const {order_by="PRICE_HIGH",category="",title_search="",rating="1"} = req.query
    const order = order_by === "PRICE_HIGH" ? "DESC" : "ASC"
    const rating1=parseInt(rating)
    const query=`SELECT * FROM products WHERE image_url LIKE ? AND title LIKE ? AND rating > ? ORDER BY price ${order}`
    db.all(query,[`%${category}%`,`%${title_search}%`,rating1],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        res.status(200).json({
            products : rows
        })
    })
})

app.get("/productsList",(req,res)=>{
    const {order_by="PRICE_HIGH",category="",title_search="",rating=1} = req.query
    const order = order_by === "PRICE_HIGH" ? "DESC" : "ASC"
    const query=`SELECT * FROM productsList WHERE category LIKE ? AND title LIKE ? AND rating > ? ORDER BY price ${order}`
    db.all(query,[`%${category}%`,`%${title_search}%`,rating],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        res.status(200).json({
            products : rows
        })
    })
})

app.get("/productsList/:id",(req,res)=>{
    const {id} = req.params

    const query = `SELECT * FROM productsList WHERE id = ?`
    db.get(query,[id],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        const category = rows.category
        const query1 = `SELECT * FROM productsList WHERE category = ?`
        db.all(query1,[category],(err,rows)=>{
            if (err){
                return res.status(400).json({
                    error_msg : err.message
                })
            }
            res.status(200).json(rows)
        })
    })
})

app.get("/products/prime",(req,res)=>{
    const query =`SELECT * FROM products WHERE image_url LIKE ? ORDER BY price DESC LIMIT 3`
    db.all(query,[`%${'clothes'}%`],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        res.status(200).json(rows)
    })
})

app.delete("/products/:id",(req,res)=>{
    const {id}=req.params
    const query=`DELETE FROM products WHERE id=?`
    db.run(query,[id],(err)=>{
        if (err){
            return res.status(400).json({
                error_msg:err.message
            })
        }
        if (this.changes===0){
            return res.status(400).json({
                message : "id not found"
            })
        }
        res.status(200).json({
            message : "deleted succesfully"
        })
    })
})

app.delete("/products",(req,res)=>{
    const query = `DELETE FROM products`
    db.run(query,[],(err)=>{
        if (err){
            return res.status(400).json({
                error_msg : "failed to delete all products"
            })
        }
        res.status(200).json({
            message : "all products delete successfully"
        })
    })
})
app.listen(5000, (err)=>{
    if (err){
        console.log(`error : ${err.message}`)
    }else{
        console.log("server is running at 5000")
    }
})