const router = require("express").Router();
const uploader= require ("../middlewares/uploader")

//POST "/api/upload" => recibir una imagen del FrontEnd y enviarla a Cloudinary. Enviar al FE URL de la imagen

router.post("/", uploader.single("image"), (req, res, next) => {


    if(req.file ===undefined) {
        res.status("400").json({errorMessage: "Please, choose an image in the correct format"})
        return
    }

res.json({imageUrl:req.file.path})

})




module.exports = router;
