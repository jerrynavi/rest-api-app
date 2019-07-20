import express from "express";
import { authorize, validation } from "../../middleware";
import { controllerHandler } from "../../shared/controllerHandler";
import { UserController } from "./userController";
import { UserValidationSchema } from "./userValidation";

const router = express.Router();
const call = controllerHandler;
const User = new UserController();

router.use(authorize);
router.use(validation(UserValidationSchema));

router.get("/", call(User.index, (req, res, next) => [
    req.query.sort_field,
    req.query.sort_order_mode,
    req.query.next,
    req.query.prev,
    req.query.per_page,
]));

router.post("/", call(User.addUser, (req, _res, _next) => [req.body]));

router.delete("/:id", call(User.deleteUser, (req, _res, _next) => [req.params.id]));

router.put("/", call(User.updateUser, (req, _res, _next) => [req.body]));

router.get("/:id", call(User.getUser, (req, _res, _next) => [req.params.id]));

export const UserRouter = router;
