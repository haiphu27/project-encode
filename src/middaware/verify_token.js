const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).json({errMessage: "Please Login"});

        await jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err){
                return res.status(401).json({errMessage: "Authorization token invalid", details: err.message});
            }
            req.user = decode;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            errMesage: "Internal server error occured!", details: error.message,
        });
    }
};


