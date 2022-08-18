const { expressjwt } = require("express-jwt")

const isAuthenticated = expressjwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: (req) => {
    //console.log(req.headers)
    if (req.headers === undefined || req.headers.authorization === undefined) {
      console.log("No token received")
      return null
    }

    const tokenArr = req.headers.authorization.split(" ")
    const tokenType = tokenArr[0]
    const token = tokenArr[1]

    if (tokenType !== "Bearer") {
      console.log("The token isn't valid")
      return null
    }

    console.log("The token has been received and sent")
    return token
  }
})

module.exports = isAuthenticated