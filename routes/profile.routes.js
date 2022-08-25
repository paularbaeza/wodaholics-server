const router = require("express").Router();
const User = require("../models/User.model");
const Benchmark = require("../models/Benchmark.model")

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


//GET "api/profile/friendsIds" => buscar todos los Ids amigos del usuario conectado

router.get("/friendsIds", isAuthenticated, async (req, res, next) => {
  try {
    const loggedUser = await User.findById({ _id: req.payload._id })

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

//GET "/api/profile/mybenchmarks" => buscar todos los benchmarks del usuario conectado

router.get("/mybenchmarks", isAuthenticated, async (req, res, next) => {
  const user = req.payload._id
  console.log(user)
  try{
      const allMyBenchmarks = await Benchmark.find({user: user}).populate("wod")
      res.json(allMyBenchmarks)
  }catch (error){
      next(error)
  }
})


//GET "/api/profile/search-users" => buscar usuarios en la app

router.get("/search-users", isAuthenticated, async (req, res, next) => {
    try {
      const users = await User.find()
  
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

//GET "/api/profile/:userId/info" => buscar info de usuarios

router.get("/:userId/info", isAuthenticated, async (req, res, next) => {
  const{userId} = req.params

  try {
    const user = await User.findById(userId).populate("favWods").populate("friends")

    res.json(user);
  } catch (error) {
    next(error);
  }
});


//GET "/api/profile/random-users" => traer usuarios random

router.get("/random-users", isAuthenticated, async (req, res, next) => {
  

  try {
    const allUsers = await User.find()
    const shuffledUsers =[...allUsers].sort(()=>0.5 - Math.random())
    const fiveRandomUsers = shuffledUsers.slice(0,5)
    res.json(fiveRandomUsers)

  } catch (error) {
    next(error);
  }
});






  module.exports = router;
  