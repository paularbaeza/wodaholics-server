const router = require("express").Router();
const User = require("../models/User.model");

const isAuthenticated = require("../middlewares/isAuthenticated");


//GET "api/profile/info" => Obtener informacion del perfil del usuario conectado

router.get("/info", isAuthenticated, async (req, res, next) => {
    const loggedUserId = req.payload._id
  try {

    const profileInfo = await User.findById(loggedUserId)
    res.json(profileInfo)
  } catch (error) {
    next(error);
  }
});

//PATCH "api/profile/info" => Actualizar la informacion del perfil

router.patch("/info", isAuthenticated, async (req, res, next) => {
    const loggedUserId = req.payload._id
    const { username, img} = req.body;

    try {
        await User.findByIdAndUpdate(
          {_id:loggedUserId},

          {
            username:username,
            img:img
          }
        );
    
        res.json("Perfil actualizado");
      } catch (error) {
        next(error);
      }
    });




//POST "api/profile/:userId/add-friend" => añadir un amigo

router.post("/:userId/add-friend", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  try {
    const newFriend = await User.findById(userId).select("_id");

    await User.findByIdAndUpdate(
      { _id: req.payload._id },
      { $addToSet: { friends: newFriend } }
    );

    res.json("friend added");
  } catch (error) {
    next(error);
  }
});

//GET "api/profile/friends" => buscar todos los amigos del usuario conectado

router.get("/friends", isAuthenticated, async (req, res, next) => {
  try {
    const loggedUser = await User.findById({ _id: req.payload._id }).populate(
      "friends"
    );

    const loggedUserFriends = loggedUser.friends;
    //console.log(loggedUserFriends)

    res.json(loggedUserFriends);
  } catch (error) {
    next(error);
  }
});

//POST "api/profile/:userId/delete-friend" => eliminar un amigo

router.post(
  "/:userId/delete-friend",
  isAuthenticated,
  async (req, res, next) => {
    const { userId } = req.params;

    try {
      const friendToDelete = await User.findById(userId).select("_id");

      await User.findByIdAndUpdate(
        { _id: req.payload._id },
        { $pull: { friends: friendToDelete._id } }
      );

      res.json("this friend was deleted");
    } catch (error) {
      next(error);
    }
  }
);

//GET "/api/profile/fav-wods" => buscar wods favoritos

router.get("/fav-wods", isAuthenticated, async (req, res, next) => {
  try {
    const loggedUser = await User.findById({ _id: req.payload._id }).populate(
      "favWods"
    );

    const userFavWods = loggedUser.favWods;

    res.json(userFavWods);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
