var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")



//================================
//COMMENTS ROUTES
//================================

router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req,res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err)
        }else{
            res.render("comments/new", {campground: campground})
        }
    })
})

//create comment
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment)
                    req.flash("success", "Successfully added comment")
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
            
        }    
    //create new comment
    //connect new comment to campground
})
})
//COMMENT EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back")
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back")
            }else{
                res.render("comments/edit", {campground_id: req.params.id, comment:foundComment});
            }
        });
    })
    
});

//COMMENT UPDATE
//campgrounds/:id/comments/Lcomment_id
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
})

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
    //findByIdAndRmove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back")
        }else{
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id)
        }
    })
});



module.exports = router;