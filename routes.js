const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('./db');
const { authenticate } = require('./utils');

const router = express.Router();

router.post('/get-profile', authenticate, (req,res)=>{

    db.User.findById(req.user._id).then(user => {
        res.json({success:true, message: `Fetched Profile`, user});
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

router.post('/signup',(req,res)=>{

    var newUser = req.body.newUser;

    db.User.findOne({
        $or:[{user: newUser.user}]
    }).then( user => {
        if(!user){
            bcrypt.hash(newUser.pass, 10, (error, hash) => {
                newUser.pass = hash;
                db.User.create(newUser).then(user => {
                    var payLoad = {
                        _id: user._id,
                    };
                    var token = jwt.sign(payLoad, "TEST_SECRET", {
                        expiresIn: 60*60*24
                    });
                    res.json({success:true, message: `${user.user} has been registered.`, _id:user._id, token:token});
                }).catch(error => {
                    res.send({success:false, message:`${error.message}`});
                });
            });
        }
        else res.json({success:false, message: `${user.user} already exists.`, _id:user._id});
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

router.post('/login',(req,res)=>{
    
    db.User.findOne({
        $or: [
            { user: req.body.user },
        ]
    }).then(user => {
        if(user){
            if(bcrypt.compareSync(req.body.pass, user.pass)){
                var payLoad = {
                    _id: user._id,
                };
                var token = jwt.sign(payLoad, "TEST_SECRET", {
                    expiresIn: 60*60*24
                });
                res.send({success:true, token:token, _id:user._id });
            }
            else res.json({success:false, message: 'Incorrect user or password'});
        }
        else res.json({success:false, message: 'User not found.'});
        
    }).catch(error => {
        res.send({success:false, message:error.message});
    });
});

router.post('/add-friend', authenticate, (req,res)=>{

    var newFriend = req.body.newFriend;

    db.User.findOne({user:newFriend}).then(friend => {
        db.User.findById(req.user._id).then(user1=>{
            var flag = false;
            user1.friends.forEach(element => {
                if(element.id ===  friend._id. toString()){
                    flag = true;
                }
            });
            if(flag) return res.send({success:false, message:`${newFriend} is already on your friends list`});
            db.User.updateOne(
                { _id: req.user._id},
                { $push: {
                    friends: {
                        id: friend._id
                    }
                }}).then(user => {
                res.json({success:true, message: `Added Friend`});
            }).catch(error => {
                res.send({success:false, message:`${error.message}`});
            });
        }).catch(error => {
            res.send({success:false, message:`${error.message}`});
        });
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

router.post('/get-friends-list', authenticate, (req,res)=>{
    db.User.findById(req.user._id).then(user => {
        res.send({success:true, friendsList:user.friends, message:'Retrieved Friends List'});
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

router.post('/add-zone', authenticate, (req,res)=>{

    var newZone = req.body.newZone;

    db.User.updateOne(
        { _id: req.user._id},
        { $push: {
            zones: newZone
        }}).then(user => {
        res.json({success:true, message: `Added Zone`});
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

router.post('/get-zones-list', authenticate, (req,res)=>{
    db.User.findById(req.user._id).then(user => {
        res.send({success:true, zonesList:user.zones, message:'Retrieved Zones List'});
    }).catch(error => {
        res.send({success:false, message:`${error.message}`});
    });
});

module.exports = router;