const { Router } = require("express");
const validate = require("../../../middlewares/validateMiddleware");
const { auth } = require("../../../middlewares/authMiddleware");
const {
  requireEmailVerification,
} = require("../../../middlewares/requireEmailVerification");
const {
  createAddressValidation,
  updateAddressValidation,
} = require("./address.validation");
const {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
} = require("./address.controller");
const validateObjectIdMiddleware = require("../../../middlewares/validateObjectIdMiddleware");

const router = Router();

router.use(auth);
router.use(requireEmailVerification);

/**
 * @swagger
 * /api/v1/addresses:
 *   post:
 *     summary: Create a new address
 *     tags: [ 🏠 Address]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: '+989123456789'
 *               stateId:
 *                 type: integer
 *                 example: 1001
 *               cityId:
 *                 type: string
 *                 example: '507f1f77bcf86cd799439011'
 *               addressLine:
 *                 type: string
 *                 example: '123 Main Street, Apt 4B'
 *               postalCode:
 *                 type: string
 *                 example: '12345'
 *               latitude:
 *                 type: number
 *                 example: 35.6892
 *               longitude:
 *                 type: number
 *                 example: 51.3889
 *             required:
 *               - phone
 *               - stateId
 *               - cityId
 *               - addressLine
 *               - postalCode
 *     responses:
 *       '201':
 *         description: Address created successfully
 *       '400':
 *         description: Validation error or city/state not found
 *       '401':
 *         description: Authentication required
 */
router.post("/", validate(createAddressValidation), createAddress);

/**
 * @swagger
 * /api/v1/addresses:
 *   get:
 *     summary: Get all user addresses
 *     tags: [ 🏠 Address]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of addresses
 *       '401':
 *         description: Authentication required
 */
router.get("/", getAddresses);

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   get:
 *     summary: Get a specific address
 *     tags: [ 🏠 Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Address retrieved successfully
 *       '403':
 *         description: Permission denied
 *       '404':
 *         description: Address not found
 *       '409':
 *         description: Invalid address ID format
 */
router.get("/:addressId", validateObjectIdMiddleware("addressId"), getAddress);

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   patch:
 *     summary: Update an address
 *     tags: [ 🏠 Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               stateId:
 *                 type: integer
 *               cityId:
 *                 type: string
 *               addressLine:
 *                 type: string
 *               postalCode:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Address updated successfully
 *       '400':
 *         description: Validation error or invalid city/state
 *       '403':
 *         description: Permission denied
 *       '404':
 *         description: Address not found
 */
router.patch(
  "/:addressId",
  validate(updateAddressValidation),
  validateObjectIdMiddleware("addressId"),
  updateAddress
);

/**
 * @swagger
 * /api/v1/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address
 *     tags: [ 🏠 Address]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Address deleted successfully
 *       '403':
 *         description: Permission denied
 *       '404':
 *         description: Address not found
 *       '409':
 *         description: Invalid address ID format
 */
router.delete(
  "/:addressId",
  validateObjectIdMiddleware("addressId"),
  deleteAddress
);

module.exports = router;
