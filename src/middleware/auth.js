const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  let pathname = req._parsedUrl.pathname;
  pathname = pathname.split("/")[1].toString();

  if (!token) {
    return res.status(401).send({
      message: "Access Denied!",
    });
  }

  try {
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    const permission = verified.permission.server.includes(pathname);

    if (permission) {
      console.log("success");
    } else {
      console.log("Denied");
    }

    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send({ message: "Invalid Token" });
  }
};
