const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isAuthenticated = require("../middlewares/isAuthenticated");

// POST "/api/auth/signup" => recibir la data del usuario y crearlo en la BD
router.post("/signup", async (req, res, next) => {
  const { username, email, password } = req.body;

  //validaciones
  if (!username || !email || !password) {
    res
      .status(400)
      .json({ errorMessage: "Please, you should fill all the fields"});
    return;
  }else{

  const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/;
  if (passwordRegex.test(password) === false) {
    res
    .status(400)
    .json({errorMessage:"Password must contain at least 8 characters, 1 Uppercase, 1 Lowercase, 1 Number and 1 Special character"});
    return;
  }

  try {

    //comprobar si ya existe el email o username en la BD
    const foundUserByEmail = await User.findOne({ email: email });
    if (foundUserByEmail !== null) {
      res
        .status(400)
        .json({ errorMessage: "There is already an account associated with that email." });
      return;
    }
    const foundUserByUsername = await User.findOne({ username: username });
    if (foundUserByUsername !== null) {
      res
        .status(400)
        .json({ errorMessage: "There is already an account using this username. Please choose a new one and try again." });
      return;
    }
    
    // encriptar de la contraseña
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    // crear del usuario en la BD
    await User.create({
      username: username,
      email: email,
      password: hashPassword,
    });
    res.status(201).json();
  } catch (error) {
    next(error);
  }
}
});


// POST "/api/auth/login" => comprobar las credenciales del usuario
router.post("/login", async (req, res, next) => {

    console.log(req.body)
    const { access, password } = req.body
  
    //validaciones
    if (!access || !password) {
      res.status(400).json({ errorMessage: "Please, you should fill all the fields"})
      return; 
    }
  
    try {
  
      const foundUser = await User.findOne({$or: [{username:access},{ email: access }]})
      if (foundUser === null) {
        res.status(400).json({ errorMessage: "Sorry, we didn't find an account matching these credentials" })
        return;
      }
  
      const isPasswordValid = await bcrypt.compare(password, foundUser.password)
      
      if (isPasswordValid === false) {
        res.status(400).json({ errorMessage: "Incorrect password. Please, check it and try again." })
        return;
      }
  
      const payload = {
        _id: foundUser._id,
        email: foundUser.email,
        username:foundUser.username,
        role: foundUser.role,
        img: foundUser.img
      } 
  
      const authToken = jwt.sign(
        payload,
        process.env.TOKEN_SECRET,
        { algorithm: "HS256", expiresIn: "200h" }
      )
  
      res.json({ authToken: authToken })
    } catch (error) {
      next(error)
    }
  })
  
  // GET "/api/auth/verify" => verificar si el usuario está dentro de su cuenta
  router.get("/verify", isAuthenticated, (req, res, next) => {
  
    console.log(req.payload)
    res.json(req.payload)
  
  })


module.exports = router;
