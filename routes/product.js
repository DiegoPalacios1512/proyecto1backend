const Product = require("../models/Product");
const { verifyToken, verifyTokenAuthorization, verifyTokenAdmin } = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAdmin, async (req,res) => {
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//UPDATE

router.put("/:id", verifyTokenAdmin, async (req,res) => {  
    try{
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, {new:true})
        res.status(200).json(updatedProduct);
    }catch(err){
        res.status(500).json(err);
    }
});

//DELETE

router.delete("/:id", verifyTokenAdmin, async (req,res) =>{
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted");
    }catch(err){
        res.status(500).json(err);
    }
});

//GET PRODUCT

router.get("/find/:id", async (req,res) =>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET ALL PRODUCTS

router.get("/", async (req,res) =>{
    const qNew = req.query.new;
    const qCategorie = req.query.categorie;
    try{
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(qCategorie){
            products = await Product.find().sort({categorie: {
                $in: [qCategorie],
            },
        });
        }else{
            products = await Product.find();
        }
        res.status(200).json(products);
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router