"use strict"

const jwt = require('jsonwebtoken');
const { response } = require("@src/utils");
const { User} = require("@src/models");
const { STATUS_CODE, ERROR,  } = require("@src/constants");

function VerifyAdminAuth(){
    return async function (req, res, next) {
        if (!req.headers.authorization) {
            return response.send(0, 401, "Access token missing", null, res, null);
        }
        let token;
        const hasBearerPrefix = req.headers.authorization.startsWith("Bearer ");
        if (hasBearerPrefix) token = req.headers.authorization.substring(7);
        else token = req.headers.authorization;

        if (!token || token == null) {
            return response.send(0, 401, "Access token missing", null, res, null);
        }
        jwt.verify(token, process.env.JWT_AUTH_SECRET, async (err, decoded) => {
            if (err) {
            
                if (err.message == "jwt expired") {
                    const payload = jwt.decode(token);
                    token = jwt.sign(
                        { user_id: payload.user_id },
                        process.env.JWT_AUTH_SECRET,
                        { expiresIn: "7d" }
                    );
                    return res
                        .status(401)
                        .json({
                            success: false,
                            message: "Unauthorized - Session Expired",
                            newToken: token,
                        });
                }
                return response.send(0, 401, err.message, null, res, err);
            }
            req.id = decoded.user_id;
            const user = await User.findOne({
                _id: req.id,
                deleted_at: { $exists: false },
            });
            
            req.user = user;

            if (!user) {
                return response.send(
                    0,
                    STATUS_CODE.UNAUTHORIZED,
                    "Invalid Auth key",
                    null,
                    res,
                    ERROR.UNAUTHORIZED
                );
            }
            next();
        });
    }
}
module.exports = VerifyAdminAuth;