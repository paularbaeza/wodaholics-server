const router = require("express").Router();
const Wod = require("../models/Wod.model")
const Benchmark = require("../models/Benchmark.model")
const User = require("../models/User.model")

const isAuthenticated = require("../middlewares/isAuthenticated")


//GET "/api/wods/:type" => buscar todos los wods por tipo (heroes, girls, weights)

router.get("/:type", isAuthenticated, async(req,res,next) => {
    const {type} = req.params
    try{
        const allWodsByType = await Wod.find({wodType:type})
        res.json(allWodsByType)
        //console.log(allWodsByType)
    }catch(error){
        next(error)
    }
})

//GET "/api/wods/:wodId/details" => buscar los detalles de un wod en concreto

router.get("/:wodId/details", isAuthenticated, async (req,res,next) => {
    const {wodId} = req.params

    try{
        const wodDetails = await Wod.findById({_id:wodId})
        res.json(wodDetails)
        //console.log(wodDetails)

    }catch(error){
        next(error)
    }
})

 //PATCH "/api/wods/:wodId" => actualizar un wod

 router.patch ("/:wodId", isAuthenticated, async (req,res,next) => {
     const {wodId} = req.params
     const {wodType, name, description, exercises, equipment} = req. body

     try{
         await Wod.findByIdAndUpdate({_id:wodId}, {
             wodType,
             name,
             description,
             exercises,
             equipment
         })

         res.json("Wod actualizado")

     }catch (error){
         next(error)
     }
 })


 //DELETE "/api/wods/:wodId" => eliminar un wod

 router.delete("/:wodId", isAuthenticated, async (req, res, next) => {
     const {wodId} = req.params
     try{
         await Wod.findByIdAndDelete({_id:wodId})
        
         res.json("Wod borrado")

     }catch (error){
         next(error)
     }
 })


//POST "/api/wods/create" => crear un wod

router.post("/create", isAuthenticated, async (req, res, next) => {
    const {wodType, name, description, exercises, equipment} = req. body

    //console.log(req.payload)
    if (!wodType || !name || !description || !exercises || !equipment) {
        res.json({errorMessage: "Please, fill all the fields"})
    }else{

    try{
        const newWod = await Wod.create ({
            creator: req.payload._id,
            wodType, 
            name, 
            description, 
            exercises, 
            equipment
        })

        res.json(newWod)
    }
    catch (error){
        next(error)
    }
    }

})

//POST "/api/wods/:wodId/add-fav" => añadir un wod a favorito

router.post("/:wodId/add-fav", isAuthenticated, async (req, res, next) => {
    const {wodId} = req.params
  
      try {
          const wodToAdd = await Wod.findById(wodId).select("_id");
          
            await User.findByIdAndUpdate({_id: req.payload._id}, {$addToSet: {favWods: wodToAdd}})
          res.json("wod added to favorite list")
      } catch (error) {
        next(error);
      }
  });


  //POST "/api/wods/:wodId/delete-fav" => eliminar un wod de favoritos

router.post("/:wodId/delete-fav", isAuthenticated, async (req, res, next) => {
    const {wodId} = req.params
  
      try {
          const wodToDelete = await Wod.findById(wodId).select("_id");
            await User.findByIdAndUpdate({_id: req.payload._id}, {$pull: {favWods: wodToDelete._id}})
          res.json("wod deleted from your favorite list")
      } catch (error) {
        next(error);
      }
  });



module.exports = router;
