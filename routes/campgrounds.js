var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var Middleware = require("../middleware");


router.get("/campgrounds", function(req, res){
    Campground.find({})
    .then(function(campgrounds){
        res.render("campgrounds/index", {campgrounds: campgrounds,  currentUser: req.user});
    })
    .catch(function(err){
        console.log(err);
    });
});

router.post("/campgrounds", Middleware.isLoggedIn, function(req, res){
    Campground.create(req.body.campground)
    .then(function(camp){
        camp.author.id= req.user._id;
        camp.author.username= req.user.username;
        camp.save();
        res.redirect("/campgrounds");
    })
    .catch(function(err){
        console.log(err);  
    });
});

router.get("/campgrounds/new", Middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new", {show_page: "community"});
});

router.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec()
    .then(function(foundCampground){
        res.render("campgrounds/show", {campground : foundCampground});
    })
    .catch(function(err){
        console.log(err);
    });
});

// For Editing and Updating Campground
router.get("/campgrounds/:id/edit", Middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

router.put("/campgrounds/:id", Middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// Destroying the campground
router.delete("/campgrounds/:id", Middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       } else {
           res.redirect("/campgrounds");
       }
    });
 });

module.exports= router;