const router = require("express").Router();
const Comment = require("../models/Comment.model");

const isAuthenticated = require("../middlewares/isAuthenticated");

//POST "/api/comment/:wodId" => crear un comentario

router.post("/:wodId", isAuthenticated, async (req, res, next) => {
  const { title, comment } = req.body;
  const {wodId} = req.params

  if (!title || !comment) {
    res.json({ errorMessage: "Please, fill all the fields" });
  } else {
    try {
      const newComment = await Comment.create({
        user: req.payload._id,
        wod: wodId,
        title: title,
        comment: comment,
      });

      res.json(newComment);
    } catch (error) {
      next(error);
    }
  }
});

//GET "/api/comment/:wodId" => buscar todos los comentarios de un wod

router.get("/:wodId", isAuthenticated, async (req, res, next) => {
  const { wodId } = req.params;
  try {
    const allComments = await Comment.find({ wod: wodId });
    res.json(allComments);
    //console.log(allComments)
  } catch (error) {
    next(error);
  }
});


//PATCH "/api/comment/:commentId" => actualizar un comentario

router.patch("/:commentId", isAuthenticated, async (req, res, next) => {
  const {commentId } = req.params;
  const { title, comment} = req.body;

  try {
    await Comment.findByIdAndUpdate(
      { _id: commentId },
      {
        title:title,
        comment:comment
      }
    );

    res.json("Comentario actualizado");
  } catch (error) {
    next(error);
  }
});

//DELETE "/api/comment/:commentId" => eliminar un comentario

router.delete("/:commentId", isAuthenticated, async (req, res, next) => {
  const { commentId } = req.params;
  try {
    await Comment.findByIdAndDelete({ _id: commentId });
    res.json("Comentario borrado");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
