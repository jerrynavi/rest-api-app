import { BaseController } from "../baseController";
import { UserService } from "./userService";
// import { IUserModel } from "../../interfaces";
import { IUser } from ".";
import { AppError } from "../../utils/app-error";

/**
 * User controller
 *
 * @export
 * @class UserController
 */
export class UserController extends BaseController {
    private _userService = new UserService();

    public index = async (sort_field, sort_order_mode, next, prev, per_page) => {
        const records = await this._userService.getAllUsers(sort_field, sort_order_mode, next, prev, per_page);
        return this.sendResponse(records);
    }

    public getUser = async (id: number) => {
        const _user = await this._userService.getUser(id);
        return this.sendResponse(_user);
    }

    /**
     * addUser
     */
    public addUser = async (user: IUser) => {
        const _user = await this._userService.addUser(user);
        return this.sendResponse(_user);
    }

    /**
     * deleteUser
     */
    public deleteUser = async (id: number) => {
        if (id == 1) {
            throw new AppError("Cannot delete root user");
        }
        const deleted = await this._userService.deleteUser(id);
        return this.sendResponse(deleted);
    }

    /**
     * updates user data
     */
    public updateUser = async (data: IUser) => {
        const _user = await this._userService.updateUser(data);
        return this.sendResponse(_user);
    }
}
