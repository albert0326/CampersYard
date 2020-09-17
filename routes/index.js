var express= require("express");
var router= express.Router();
var passport= require("passport");
var	Campground 	= require("../models/campground"),
	Comment		= require("../models/campground"),
	User		= require("../models/user"),
	middleware	= require("../middleware");

router.get("/", function(req, res){
	res.render("index");
});

// Sign Up routes

router.get("/register", function(req, res){
	res.render("register", {page: 'register'})
});

router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			 return res.render("register", {"error": err.message});
		}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Welcome to YelpCamp  "+ user.username);
				res.redirect("/campgrounds");
		});
	});
});

// login routes

router.get("/login", function(req, res){
	res.render("login", {page: 'login'})
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(req, res){
});

// logout route

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out");
	res.redirect("/campgrounds");
});

module.exports= router;