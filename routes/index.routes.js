const router = require("express").Router();



//GET "/api"
router.get("/", (req, res, next) => {
  res.json("All good in here");
});

// You put the next routes here 👇
// example: router.use("/auth", authRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const wodsRoutes = require("./wods.routes")
router.use("/wods", wodsRoutes)


const benchmarksRoutes = require("./benchmarks.routes")
router.use("/benchmarks", benchmarksRoutes)

module.exports = router;
