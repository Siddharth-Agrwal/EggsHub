var express = require("express");
var router  = express.Router();
var Country = require("../models/countries");


router.get("/dashboard", function(req,res){
    res.render("dashboard",{show_page: "dashboard"});
});

router.get("/supplymap", function(req,res){
  res.render("supplymap");
});

router.get("/demandmap", function(req,res){
  res.render("demandmap");
});

router.get("/about", function(req,res){
  res.render("about", {show_page: "about"});
});

router.get("/contact", function(req, res){
  res.render("contact");
});

router.get("/compare", function(req, res){
  res.render("compare",{show_page: "compare"});
});

router.get("/compare/ans", function(req,res){
    Country.find({name: req.query.country1})
      .then(function(c1){
        Country.find({name: req.query.country2})
          .then(function(c2){
            res.render("compare_ans", {c1 : c1, c2: c2});
          });
      });
});

module.exports= router;