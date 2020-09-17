var express= require("express");
var router= express.Router();
var	Campground 	= require("../models/campground"),
	Comment		= require("../models/comment"),
	middleware	= require("../middleware");


router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else(
			res.render("comments/new", {campground:campground})
		)
	});
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
	
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err)
		}else{
					Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err)
				}else{
					comment.author.id= req.user._id;
					comment.author.username= req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully created a comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err)
		}else{
			Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					console.log(err)
				}else{
					res.render("comments/edit", {comment:foundComment, campground:foundCampground})
				}
			});
		}
	});
});

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, editedComment){
		if(err){
			console.log(err)
		} else{
			req.flash("success", "Comment Successfully Updated");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err)
		}else{
			req.flash("success", "Comment Deleted Successfully");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});


module.exports= router;