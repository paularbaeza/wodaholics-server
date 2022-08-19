const router = require("express").Router();
const User = require("../models/User.model");

const isAuthenticated = require("../middlewares/isAuthenticated");

//POST "/profile/:userId/add-friend" => añadir un amigo

router.post("/:userId/add-friend", isAuthenticated, async (req, res, next) => {
  const {userId} = req.params


    try {
        const newFriend = await User.findById(userId).select("_id");

        await User.findByIdAndUpdate({_id: req.payload._id}, {$addToSet: {friends: newFriend}})
        
        res.json("friend added")
    } catch (error) {
      next(error);
    }
});

//GET "/profile/friends" => buscar todos los amigos del usuario conectado

router.get("/friends", isAuthenticated, async (req, res, next) => {
    try {
      const loggedUser = await User.findById({ _id: req.payload._id }).populate("friends");
  
      
      const loggedUserFriends = loggedUser.friends;
      //console.log(loggedUserFriends)
  
      res.json(loggedUserFriends);
    } catch (error) {
      next(error);
    }
  });



//POST "/profile/:userId/delete-friend" => eliminar un amigo

router.post("/:userId/delete-friend", isAuthenticated, async (req, res, next) => {
    const {userId} = req.params
  
  
      try {
          const friendToDelete = await User.findById(userId).select("_id");

          await User.findByIdAndUpdate({_id: req.payload._id}, {$pull: {friends: friendToDelete._id}})
          
          res.json("this friend was deleted")
      } catch (error) {
        next(error);
      }
  });

module.exports = router;
