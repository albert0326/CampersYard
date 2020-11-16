var express			= require("express"),
	mongoose		= require("mongoose"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	bodyParser		= require("body-parser"),
	app				= express(),
	methodOverride	= require("method-override"),
	flash			= require("connect-flash"),
	Campground 		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User			= require("./models/user"),
	seedDB 			= require("./seeds");

var indexRoutes		= require("./routes/index"),
	campgroundRoutes= require("./routes/campgrounds"),
	commentRoutes	= require("./routes/comments");


mongoose.connect('mongodb+srv://albert:***********@cluster0.vehvp.mongodb.net/yelpCamp?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
mongoose.set('useFindAndModify', false);
app.locals.moment = require('moment');


// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret:"albert is a brilliant boy",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.error		= req.flash("error");
	res.locals.success		= req.flash("success");
	res.locals.currentUser	= req.user;
	next();
});

app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(" Yelpcamp Server Has Started!");
});
