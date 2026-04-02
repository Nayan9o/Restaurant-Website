import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  getMenus,
  getMenu,
  addMenu,
  editMenu,
  removeMenu,
} from "../controllers/menuController.js";
import { verifyJWT, authorize } from "../middleware/auth.js";

const router = express.Router();

// GET /api/menu - Public
router.get("/", getMenus);

// GET /api/menu/:id - Public
router.get(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid menu ID")],
  getMenu,
);

// POST /api/menu - Admin only
router.post(
  "/",
  verifyJWT,
  authorize("admin"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name required")
      .isLength({ max: 100 })
      .withMessage("Name too long"),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description required")
      .isLength({ max: 500 })
      .withMessage("Description too long"),
    body("category")
      .trim()
      .notEmpty()
      .isIn(["appetizer", "main", "dessert", "beverage", "special"])
      .withMessage("Invalid category"),
    body("price")
      .isFloat({ min: 0 })
      .withMessage("Price must be positive number"),
    body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
    body("isAvailable").optional().isBoolean(),
    body("ingredients")
      .optional()
      .isArray()
      .withMessage("Ingredients must be array"),
  ],
  addMenu,
);

// PUT /api/menu/:id - Admin only
router.put(
  "/:id",
  verifyJWT,
  authorize("admin"),
  [
    param("id").isMongoId().withMessage("Invalid menu ID"),
    body("name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Name too long"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description too long"),
    body("category")
      .optional()
      .trim()
      .isIn(["appetizer", "main", "dessert", "beverage", "special"])
      .withMessage("Invalid category"),
    body("price")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Price must be positive number"),
    body("imageUrl").optional().isURL().withMessage("Invalid image URL"),
    body("isAvailable").optional().isBoolean(),
    body("ingredients")
      .optional()
      .isArray()
      .withMessage("Ingredients must be array"),
  ],
  editMenu,
);

// DELETE /api/menu/:id - Admin only
router.delete(
  "/:id",
  verifyJWT,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Invalid menu ID")],
  removeMenu,
);

// Validation middleware
router.use((req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
});

export default router;
