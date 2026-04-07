"use strict";

const jwt = require("jsonwebtoken");
const { response } = require("@src/utils");
const { Customer } = require("@src/models");
const { STATUS_CODE, ERROR } = require("@src/constants");

function verifyAuth() {
  return async function (req, res, next) {
    if (!req.headers.authorization) {
      return response.send(0, STATUS_CODE.UNAUTHORIZED, "Access token missing", null, res, null);
    }

    let token;
    const hasBearerPrefix = req.headers.authorization.startsWith("Bearer ");
    token = hasBearerPrefix ? req.headers.authorization.substring(7) : req.headers.authorization;

    if (!token) {
      return response.send(0, STATUS_CODE.UNAUTHORIZED, "Access token missing", null, res, null);
    }

    jwt.verify(token, process.env.JWT_AUTH_SECRET, async (err, decoded) => {
      if (err) {
        if (err.message === "jwt expired") {
          const payload = jwt.decode(token);
          if (!payload || !payload.customer_id) {
            return response.send(0, STATUS_CODE.UNAUTHORIZED, "Invalid token", null, res, null);
          }

          const newToken = jwt.sign(
            { customer_id: payload.customer_id },
            process.env.JWT_AUTH_SECRET,
            { expiresIn: "7d" }
          );

          return res.status(401).json({
            success: false,
            message: "Unauthorized - Session Expired",
            newToken
          });
        }
        return response.send(0, STATUS_CODE.UNAUTHORIZED, err.message, null, res, err);
      }
      
      req.id = decoded.customer_id;

      const customer = await Customer.findOne({
        _id: req.id,
        deleted_at: { $exists: false },
      });

      if (!customer) {
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid Auth key",
          null,
          res,
          ERROR.UNAUTHORIZED
        );
      }

      req.customer = customer;
      next();
    });
  };
}

module.exports = verifyAuth;
