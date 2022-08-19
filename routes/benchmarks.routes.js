const router = require("express").Router();
const Wod = require("../models/Wod.model")
const Benchmark = require("../models/Benchmark.model")

const isAuthenticated = require("../middlewares/isAuthenticated")


//POST "/api/benchmarks/:wodId" => crear un benchmark de un wod en concreto

router.post("/:wodId", isAuthenticated, async (req, res, next) => {
    const {score, date} = req.body
    const {wodId} = req.params

    //console.log(req.payload)
    if (!score || !date) {
        res.status(400).json({errorMessage: "Please, fill all the fields"})
    }

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
})

//GET "/api/benchmarks/:wodIid" => buscar todos los benchmarks de un wod concreto

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


//GET "/api/benchmarks/:wodId/higher" => buscar las mayores puntuaciones en un wod EMOM, AMRAP o max-kg

router.get("/:wodId/higher", isAuthenticated, async (req, res, next) => {

    const {wodId} = req.params
    
    try{
        const higherBenchmarks = await Benchmark.find({$and: [{wod:wodId}, {category: {$in: ["AMRAP", "EMOM", "max-kg" ]}}]}).limit(5).sort({"score": -1}).collation({locale: "en_US", numericOrdering: true})
        console.log(higherBenchmarks)
        res.json(higherBenchmarks)

    }catch (error){
        next(error)
    }
})

//GET "/api/benchmarks/:wodId/lower-time" => buscar las mayores puntuaciones en un wod For time

router.get("/:wodId/lower-time", isAuthenticated, async (req, res, next) => {

    const {wodId} = req.params
    
    try{
        const lowerTime = await Benchmark.find({$and: [{wod:wodId}, {category:"for time"}]}).limit(5).sort({"score": 1}).collation({locale: "en_US", numericOrdering: true})
        console.log(lowerTime)
        res.json(lowerTime)

    }catch (error){
        next(error)
    }
})

//GET "/api/benchmarks/:wodIid/benchmarks/all" => buscar todas mis puntuaciones de un wod

router.get("/:wodId/benchmarks/all", isAuthenticated, async (req, res, next) => {
    const {wodId} = req.params
    const user= req.payload._id
    try{
        const allBenchmarks = await Benchmark.find({$and: [{wod:wodId}, {user:user}]}).sort({"date": -1})
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
        await Benchmark.findByIdAndUpdate({_id:benchmarkId}, {
            score: score,
            date: date
        })

        res.json("benchmark actualizado")

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




module.exports = router;
