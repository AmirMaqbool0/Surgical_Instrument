const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("@src/models");
const { validate } = require("@src/middlewares");
const { Joi } = require("@src/lib");
const { response } = require("@src/utils");
const { STATUS_CODE } = require("@src/constants");

const SECRET_KEY = process.env.JWT_AUTH_SECRET;

//usertoken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzhmNzE1MzJjNTNhYzdkN2FjYTBiNTkiLCJlbWFpbCI6InV6YWlycmFqcHV0MjAwMUBnbWFpbC5jb20iLCJpYXQiOjE3Mzc0NTM5MDcsImV4cCI6MTc0MDA0NTkwN30.Bt08d5T4SUK05OvNuxrEkeeDPrk3VA3SfOyPMDTMUtQ"

const CONTROLLER = [
  validate({
    body: Joi.object().keys({
      email: Joi.string().email().required().messages({
        "any.required": "Email is required",
      }),
      password: Joi.string().required().messages({
        "any.required": "Password is required",
      }),
    }),
  }),

  async function login(req, res) {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid email or password",
          null,
          res,
          "User not found"
        );
      }

      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return response.send(
          0,
          STATUS_CODE.UNAUTHORIZED,
          "Invalid email or password",
          null,
          res,
          "Incorrect password"
        );
      }

      // Generate a new token
      const token = jwt.sign(
        { user_id: user._id, email: user.email },
        SECRET_KEY,
        { expiresIn: "30d" }
      );

      // Save the token in the database
      user.token = token;
      await user.save();

      // Respond with user data and token
      return response.send(
        1,
        STATUS_CODE.OK,
        "Login successful",
        { user: user.serialize(), token },
        res
      );
    } catch (error) {
      console.error(error);
      return response.send(
        0,
        STATUS_CODE.INTERNAL_SERVER_ERROR,
        "An error occurred during login",
        null,
        res,
        error
      );
    }
  },
];

module.exports = CONTROLLER;


/**
 * @swagger
 * /auth/admin/interaction/login:
 *   post:
 *     tags: [Admin User Authentication]
 *     summary: Initiate login process
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "uzairrajput2001@gmail.com"
 *               password:
 *                 type: string
 *                 example: "admin123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized - Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Couldn't login
 */
