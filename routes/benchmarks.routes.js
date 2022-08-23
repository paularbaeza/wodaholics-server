const router = require("express").Router();
const Benchmark = require("../models/Benchmark.model")

const isAuthenticated = require("../middlewares/isAuthenticated")


//POST "/api/benchmarks/:wodId" => crear un benchmark de un wod en concreto

router.post("/:wodId", isAuthenticated, async (req, res, next) => {
    const {score, date} = req.body
    const {wodId} = req.params

    //console.log(req.payload)
    if (!score || !date) {
        res.status(400).json({errorMessage: "Please, fill all the fields with valid data."})
    }else{

    try{
        const newBenchmark = await Benchmark.create ({
            user: req.payload._id,
            wod: wodId,
            score: score,
            date: date
        })

        res.json(newBenchmark)
    }
    catch (error){
        next(error)
    }
}
})

//GET "/api/benchmarks/:wodId" => buscar todos los benchmarks de un wod concreto

router.get("/:wodId", isAuthenticated, async (req, res, next) => {
    const {wodId} = req.params
    try{
        const allBenchmarks = await Benchmark.find({wod:wodId}).populate("user")
        console.log(allBenchmarks)
        res.json(allBenchmarks)

    }catch (error){
        next(error)
    }
})



//GET "/api/benchmarks/:userId" => buscar todos los benchmarks de un usuario

router.get("/all/:userId", isAuthenticated, async (req, res, next) => {
    const {userId} = req.params
    try{
        const allUserBenchmarks = await Benchmark.find({user:userId}).populate("user").populate("wod")
        //console.log(allUserBenchmarks)
        res.json(allUserBenchmarks)

    }catch (error){
        next(error)
    }
})



//GET "/api/benchmarks/:wodId/highscores" => buscar las mayores puntuaciones de cualquier wod

router.get("/:wodId/highscores", isAuthenticated, async (req, res, next) => {

    const {wodId} = req.params
    
    try{
        const allWodsBenchmarks = await Benchmark.find({wod:wodId}).populate("wod")
        const lowerTime = await Benchmark.find({$and: [{wod:wodId}, {category:"for time"}]}).limit(3).sort({"score": 1}).collation({locale: "en_US", numericOrdering: true}).populate("user")
        const higherBenchmark= await Benchmark.find({$and: [{wod:wodId}, {category: {$in: ["AMRAP", "EMOM", "max-kg" ]}}]}).limit(3).sort({"score": -1}).collation({locale: "en_US", numericOrdering: true}).populate("user")   
        console.log(allWodsBenchmarks)
        allWodsBenchmarks.map((eachBenchmark)=> {
            if (eachBenchmark.wod[0].category=== "for time"){        
                res.json(lowerTime)
            }
            
            if (eachBenchmark.wod[0].category=== "AMRAP" || eachBenchmark.wod[0].category=== "EMOM" ||eachBenchmark.wod[0].category=== "max-kg" ){
                res.json(higherBenchmark)
            }
        })


    }catch (error){
        next(error)
    }
})

//TODO GET "/api/benchmarks/:wodId/fortime/highscore" => Buscar la mayor puntuacion del usuario conectado de un wod For Time (no tiene gráfica)
router.get("/:wodId/fortime/highscore", isAuthenticated, async (req,res,next)=> {
    const {wodId} = req.params
    const user= req.payload._id

    try{
        const lowerTime = await Benchmark.find({$and: [{wod:wodId}, {user: user}, {category:"for time"}]}).limit(1).sort({"score": 1}).collation({locale: "en_US", numericOrdering: true})

        console.log(lowerTime)
        res.json(lowerTime)

    }catch (error){
        next(error)
    }
})


//GET "/api/benchmarks/:wodIid//all" => buscar todas mis puntuaciones de un wod

router.get("/:wodId/all", isAuthenticated, async (req, res, next) => {
    const {wodId} = req.params
    const user= req.payload._id
    try{
        const allBenchmarks = await Benchmark.find({$and: [{wod:wodId}, {user:user}]}).sort({"date": 1})
        console.log(allBenchmarks)
        res.json(allBenchmarks)

    }catch (error){
        next(error)
    }
})


//PATCH "/api/benchmarks/:benchmarkId" => actualizar un benchmark

router.patch ("/:benchmarkId", isAuthenticated, async (req,res,next) => {
    const {benchmarkId} = req.params
    const {score, date} = req. body


    try{
        await Benchmark.findByIdAndUpdate(benchmarkId, {
            score: score,
            date: date
        })

        res.json("benchmark updated")

    }catch (error){
        next(error)
    }
})


//DELETE "/api/benchmarks/:benchmarkId" => eliminar un benchmark

router.delete("/:benchmarkId", isAuthenticated, async (req, res, next) => {
    const {benchmarkId} = req.params
    try{
        await Benchmark.findByIdAndDelete({_id:benchmarkId})
        
        res.json("benchmark borrado")

    }catch (error){
        next(error)
    }
})

// //TODO GET "/api/benchmarks/:userId/highscores" => traer todos los highscores de un usuario

// router.get("/:userId/:wodId/highscores", isAuthenticated, async (req, res, next) => {
//     const {userId, wodId} = req.params
//     try{
//         const allBenchmarks = await Benchmark.find({user:userId}).sort({"date": 1})
//         //console.log(allBenchmarks)

//         const lowerTime = await Benchmark.find({$and: [{wod:wodId}, {user:userId}, {category:"for time"}]}).limit(1).sort({"score": -1}).collation({locale: "en_US", numericOrdering: true})
//         const higherBenchmark= await Benchmark.find({$and: [{wod:wodId}, {user:userId}, {category: {$in: ["AMRAP", "EMOM", "max-kg" ]}}]}).limit(1).sort({"score": 1}).collation({locale: "en_US", numericOrdering: true}) 
//         //console.log(lowerTime)
//         console.log(higherBenchmark)
//         res.json(allBenchmarks)

//     }catch (error){
//         next(error)
//     }
// })


module.exports = router;
