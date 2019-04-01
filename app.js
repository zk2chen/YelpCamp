var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment")
var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override")




//requiring routes
var commentRoutes = require("./routes/comments")
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index")


mongoose.connect("mongodb://localhost/yelp_camp_v10")
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am bad at fortnite",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error  = req.flash("error");
    res.locals.success = req.flash("success")
    next();
});

app.use(indexRoutes);
app.use(commentRoutes);
app.use(campgroundRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server Has Started");
});