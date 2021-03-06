import passport from "passport";
import { UserModel } from "./../api/User";
import { AppError } from "./../utils/app-error";

/**
 * middleware for checking authorization with HTTP Basic Auth
 */
export const authorize = (req, res, next) => {
    passport.authenticate("basic", { session: false }, async (error, token) => {
        if (error || !token) {
            return next(new AppError("Unauthorized", null, 401));
        }
        try {
            const user = await UserModel.findOne({ where: { username: token.username } });
            if (!user) {
                return next(new AppError("Unauthorized", null, 401));
            }
            req.user = user;
        } catch (error) {
            return next(error);
        }
        next();
    })(req, res, next);
};
