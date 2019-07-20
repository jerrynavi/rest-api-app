import bcrypt from "bcrypt";
import _ from "lodash";
import { BasicStrategy as Strategy } from "passport-http";
import { UserModel } from "../api/User";
import { IUserModel } from "../interfaces";

export const loginStrategy = new Strategy(async (userid, password, done) => {
    try {
        let loginFailed = false;
        const user = <IUserModel> await UserModel.findOne({ where: { username: userid } });
        if (user) {
            const validate = await bcrypt.compare(password, user.password);
            if (!validate) {
                loginFailed = true;
            }
        } else {
            loginFailed = true;
        }
        if (!loginFailed) {
            // Send the user information to the next middleware
            return done(null, user);
        }

    } catch (error) {
        return done(error);
    }
});
