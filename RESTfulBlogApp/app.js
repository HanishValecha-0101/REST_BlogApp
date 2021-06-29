var bodyparser = require("body-parser");
var  mongoose   = require("mongoose");
var  express    = require("express");
var  app        = express();
var expressSanitizer = require('express-sanitizer');
var  methodOverride = require('method-override');

    //App CONFIG
    const url = 'mongodb://localhost:27017/restful_blog_app';

   //const client = new MongoClient(url, {useUnifiedTopology: true});

    mongoose.connect(url,{ useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex: true});
    app.set("view engine","ejs");
    app.use(express.static("public"));//to serve our custom stylesheet
    app.use(bodyparser.urlencoded({extended:true}));
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));
    
//Mongoose /model config
    var blogSchema = new mongoose.Schema({
        title:String,
        image:String,
        body:String,
        created:{type:Date, default:Date.now()}
    });
    
    var Blog = mongoose.model("Blog",blogSchema);
    //RESTFUL ROUTES

   // Blog.create({
    //    title: "test blog",
     //   image:"https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      //  body:"WELCOME TO BLOGPOST!!"
        
   // })

    app.get("/",function(req,res){
        res.redirect("/blogs");
    })

    app.get("/blogs",function(req,res){
    
        Blog.find({},function(err,blogs){
            if(err){
                console.log("ERROR!!");
            }else{
                res.render("index",{blogs: blogs});
            }
        });
});

//NEW ROUTE

app.get("/blogs/new",function(req,res){
    res.render("new");
});

//Create route

app.post("/blogs",function(req,res){
    console.log(req.body);
    req.body.blog.body = req.sanitize(req.body.blog.body);
    console.log("==============");
    console.log(req.body);

    Blog.create(req.body.blog,function(err,newBlog){

        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    })
})

//SHOW ROUTE

app.get("/blogs/:id",function(req,res){

    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
})


//EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){

    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog: foundBlog});
        }
    })

    
})

//UPDATE Route

app.put("/blogs/:id",function(req,res){
    
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id );
        }
    })
})

//DELETE ROUTE
app.delete("/blogs/:id",function(req,res){

    Blog.findByIdAndRemove(req.params.id,function(err){

        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });

})











app.listen("3000",function(){
    console.log("Server has started!!");
})




