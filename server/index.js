
const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const path = require("path")

const db = require("./db")

const app = express()
app.use(express.json())

app.post("/api/register",(req,res)=>{
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

app.post("/api/login",(req,res)=>{
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

function authenticateToken(req,res,next){
    const authHeader = req.headers["authorization"]
    const token = authHeader &&  authHeader.split(" ")[1]
    if (!token){
        return res.status(400).json({
            message : "JWTtoken required"
        })
    }
    
    jwt.verify(token,"saikiran",(err,payload)=>{
        if (err){
            return res.status(400).json({
                message : "JWTtoken invalid"
            })
        }
        else{
            req.username=payload.username
            next()
        }
    })
    
}

// app.post("/api/products",authenticateToken,(req,res)=>{
//     const {title,brand,id,rating,image_url,price} = req.body
//     console.log(title)
//     if (!title || !brand || !id || !rating || !image_url || !price){
//         console.log("all fields required")
//         return res.status(400).json({
//             message : "all fields required"
//         })
//     }
//     const query = `INSERT INTO products (title,brand,price,id,image_url,rating) values (?, ?, ?, ?, ?, ?)`
//     db.run(query,[title,brand,price,id,image_url,rating],(err)=>{
//         if (err){
//             console.log("error")
//             return res.status(500).json({
//                 error : err.message
//             })
//         }
//         res.status(200).json({
//             message : "product inserted successfully"
//         })
//     })
// })

// app.post("/api/products/bulk",authenticateToken,(req,res)=>{
//     const products=req.body.products
//     const productData=products.map(()=>"(?, ?, ?, ?, ?, ?)").join(",")
//     const values = products.flatMap(p=>[p.title, p.brand, p.price, p.id, p.image_url, p.rating])
//     const query = `INSERT INTO products (title,brand,price,id,image_url,rating) values ${productData}`
//     db.run(query,values,function(err){
//         if (err){
//             return res.status(400).json({
//                 error : err.message
//             })
//         }
//         res.status(200).json({
//             inserted : this.changes,
//             message : "success"
//         })
//     })
// })

app.post("/api/productsList/bulk",authenticateToken,(req,res)=>{
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

// app.get("/productsList",authenticateToken,(req,res)=>{
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

app.delete("/api/productsList",authenticateToken,(req,res)=>{
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

// app.get("/api/products",authenticateToken,(req,res)=>{
//     const {order_by="PRICE_HIGH",category="",title_search="",rating="1"} = req.query
//     const order = order_by === "PRICE_HIGH" ? "DESC" : "ASC"
//     const rating1=parseInt(rating)
//     const query=`SELECT * FROM products WHERE image_url LIKE ? AND title LIKE ? AND rating > ? ORDER BY price ${order}`
//     db.all(query,[`%${category}%`,`%${title_search}%`,rating1],(err,rows)=>{
//         if (err){
//             return res.status(400).json({
//                 error_msg : err.message
//             })
//         }
//         res.status(200).json({
//             products : rows
//         })
//     })
// })

app.get("/api/productsList",authenticateToken,(req,res)=>{
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

app.get("/api/productsList/:id",authenticateToken,(req,res)=>{
    const {id} = req.params

    const query = `SELECT * FROM productsList WHERE id = ?`
    db.get(query,[id],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        if (!rows){
            return res.status(400).json({
                message : "product not found"
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

app.get("/api/products/prime",authenticateToken,(req,res)=>{
    const username = req.username
    if (username!=="chintu"){
        console.log("you are not a prime subscriber")
        return res.status(400).json({
            message : "you are not a prime subscribe"
        })
    }
    const query =`SELECT * FROM productsList WHERE category = ? ORDER BY rating DESC LIMIT 3`
    db.all(query,["mens-shirts"],(err,rows)=>{
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        res.status(200).json(rows)
    })
})

app.delete("/api/productsList/:id",(req,res)=>{
    const {id} = req.params
    const query = `DELETE FROM productsList WHERE id = ?`
    db.run(query,[id],function (err) {
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
        if (this.change===0){
            return res.status(400).json({
                message : "id not found"
            })
        }
        res.status(200).json({
            message : "product deleted successfully"
        })
    })
})

// app.delete("/api/products/:id",authenticateToken,(req,res)=>{
//     const {id}=req.params
//     const query=`DELETE FROM products WHERE id=?`
//     db.run(query,[id],function (err) {
//         if (err){
//             return res.status(400).json({
//                 error_msg:err.message
//             })
//         }
//         if (this.changes===0){
//             return res.status(400).json({
//                 message : "id not found"
//             })
//         }
//         res.status(200).json({
//             message : "deleted succesfully"
//         })
//     })
// })

// app.delete("/api/products",authenticateToken,(req,res)=>{
//     const query = `DELETE FROM products`
//     db.run(query,[],(err)=>{
//         if (err){
//             return res.status(400).json({
//                 error_msg : "failed to delete all products"
//             })
//         }
//         res.status(200).json({
//             message : "all products delete successfully"
//         })
//     })
// })

app.delete("/api/users",(req,res)=>{
    const query =`DELETE FROM users WHERE username = ?`
    db.run(query,["chintu"],function(err){
        if (err){
            return res.status(400).json({
                error_msg : err.message
            })
        }
    })
    if (this.changes===0){
        return res.status(400).json({
            message : "username not  found"
        })
    }
    res.status(200).json({
        message : "username deleted from users table"
    })
})

app.get("/ping", (req, res) => {
  res.send("Server is awake 🚀");
});

app.use(express.static(path.join(__dirname, "../client/dist")))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})