const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); // Not used yet, but good to keep for future auth
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs'); // For checking/creating upload directory

// Middlewares
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(cors()); // Enables Cross-Origin Resource Sharing

// Database connection with MongoDB
// Ensure your MongoDB connection string is correct and accessible.
mongoose.connect("mongodb+srv://diksha:dora20rani@cluster0.wukkyck.mongodb.net/e-commerce")
    .then(() => console.log('Connected to MongoDB successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// API Creation - Root Endpoint
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// --- Image Storage Engine Setup ---
const uploadDir = './upload/images';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
    destination: uploadDir, // Directory where images will be stored
    filename: (req, file, cb) => {
        // Generates a unique filename using fieldname, current timestamp, and original extension
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Creating Upload Endpoint for images
// This endpoint handles single file uploads under the field name "product"
app.use('/images', express.static('upload/images')); // Serve static files from the 'upload/images' directory
app.post("/upload", upload.single("product"), (req, res) => {
    console.log('Received /upload request'); // ADD THIS LINE
    if (!req.file) {
        return res.status(400).json({ success: 0, message: "No file uploaded" });
    }

    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// --- Schema for creating products ---
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
        unique: true // Ensure product IDs are unique
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// --- Endpoint to add a new product ---
app.post('/addproduct', async (req, res) => {
    try {
        // Automatically generate a unique ID for the product
        let products = await Product.find({});
        let id;
        if (products.length > 0) {
            // Find the last product and increment its ID
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            // If no products exist, start with ID 1
            id = 1;
        }

        // Create a new Product instance with data from the request body
        const product = new Product({
            id: id, // Assign the generated ID
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        console.log("Attempting to save product:", product);
        await product.save(); // Save the product to the database
        console.log("Product added successfully to DB.");

        // Respond with success message and the name of the added product
        res.json({
            success: true,
            message: "Product added successfully",
            name: req.body.name,
            productId: id // Useful to return the assigned ID
        });
    } catch (error) {
        console.error("Error adding product:", error);
        // Send a 500 status code for server errors
        res.status(500).json({
            success: false,
            message: "Failed to add product",
            error: error.message
        });
    }
});

// --- Endpoint to remove a product ---
app.post('/removeproduct', async (req, res) => {
    try {
        // Find and delete a product by its ID
        const result = await Product.findOneAndDelete({ id: req.body.id });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Product not found with the given ID."
            });
        }

        console.log("Product Removed:", result.name);
        res.json({
            success: true,
            name: result.name, // Return the name of the removed product
            message: "Product removed successfully"
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove product",
            error: error.message
        });
    }
});

// --- Endpoint to get all products ---
app.get('/allproducts', async (req, res) => {
    
        let products = await Product.find({});
        console.log("All Products Fetched.");
        res.send(products); // Send the array of products as a JSON response
     
});

//Schema creating for user model
const Users=mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }

})
//Creating endpoint for registering user
app.post('/signup',async(req,res)=>{
    let check=await Users.findOne({email:req.body.email});
    if(check){
        return res.status(400).json({success:false,errors:'Existing user'})
    }
    let cart={}
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user=new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data={
        user:{
            id:user.id
        }
    }
    const token=jwt.sign(data,'secret_ecom');
    res.json({success:true,token})
})

//cerating endpoint for user login
app.post('/login',async(req,res)=>{
    let user=await Users.findOne({email:req.body.email});
    if (user){
        const passCompare = req.body.password===user.password;
        if (passCompare){
            const data={
                user:{
                    id:user.id
                }
            }
            const token=jwt.sign(data,'secret_ecom');
            res.json({success:true,token});
        }
        else{
            res.json({success:false,errors:"wrong password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong email id"})
    }
})


//Creating API for deleting a product

        // Find and delete a product by its ID
        

// Start the Express server
//creating point for new collection dta
app.get('/newcollection',async(req,res)=>{
    let products=await Product.find({});
    let newcollection =products.slice(1).slice(-8);
    console.log("NewCollection Fetched");
    res.send(newcollection);
})
//creating endpoint for popular in women category
    app.get('/popularinwomen',async(req,res)=>{
        let products=await Product.find({category:"women"});
        let popular_in_women=products.slice(0,4);
        console.log('Popular in women fetched');
        res.send(popular_in_women);
    })
    //creating middleware to fetch use
    const fetchUser=async(req,res,next)=>{
        const token =req.header('auth-token');
        if(!token){
            res.status(401).send({errors:"please authnticate using valid token"});
        }
        else{
            try{
                const data=jwt.verify(token,'secret_ecom');
                req.user=data.user;
                next();
            }
            catch(error){
           res.status(401).send({errors:"please authenticate using a valid token"})
            }
        }
    }
    //creating endpoint for adding products in cart
    app.post('/addtocart',fetchUser,async(req,res)=>{
         console.log("added",req.body.itemId);
       let userData=await Users.findOne({_id:req.user.id});
       userData.cartData[req.body.itemId]+=1;
       await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
       res.send('added')
    })


    //cerating endpoint to remove cart dat
    app.post('/removefromcart',fetchUser,async(req,res)=>{
        console.log("removed",req.body.itemId);
        let userData=await Users.findOne({_id:req.user.id});
        if(userData.cartData[req.body.itemId]>0)
       userData.cartData[req.body.itemId]-=1;
       await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
       res.send('removed')
    })

     //creating endpoint to get cart data
     app.post('/getcart',fetchUser,async(req,res)=>{
        console.log("GetCart");
        let userData=await Users.findOne({_id:req.user.id});
        res.json(userData.cartData);
     })

app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port);
    } else {
        console.log("Error occurred, server can't start: " + error);
    }
});
