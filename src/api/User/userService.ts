import bcrypt from "bcrypt";
import { UserModel } from "./userModel";
import { AppError } from "../../utils/app-error";
import { IUserModel, IPaginatedModel } from "../../interfaces";
import { IUser } from ".";

import sequelize from "sequelize";

export class UserService {

    /**
     * Gets all users in the database
     * @param {string} sortField
     * @param {string} sortOrderMode
     * @param {string} nextCursor
     * @param {string} prevCursor
     * @param {number} perPage
     */
    public getAllUsers = async (
        sortField: string,
        sortOrderMode: string,
        nextCursor: string,
        prevCursor: string,
        perPage: number,
    ): Promise<IPaginatedModel> => {
        let order: boolean = false;
        const limit: number = (perPage) ? Number(perPage) : 25;
        if (sortOrderMode) {
            switch (sortOrderMode) {
                case "asc":
                    order = false;
                    break;
                case "desc":
                    order = true;
                    break;
                default:
                    order = false;
                    break;
            }
        }
        const query: IPaginatedModel = await (<any> UserModel).paginate({
            desc: order,
            after: nextCursor,
            before: prevCursor,
            order: [sequelize.col(sortField)],
            limit,
        });

        if (!query) {
            throw new AppError("No users exist in the database", null, 404);
        }
        return query;
    }

    /**
     * Fetches and returns a single user resource
     * @public
     * @param {string} username - the username to lookup
     * @returns {(Promise<IUserModel> | null)} the user resource | null
     */
    public getUser = async (id: number): Promise<IUserModel> => {

        const user: IUserModel = await UserModel.findOne({
            where: { id },
            attributes: {
                exclude: [
                    "password", "email_verification_code",
                ],
            },
        });

        if (user) {
            return user;
        }
        throw new AppError(`User not found.`, null, 404);
    }

    /**
     * Updates a user resource
     * @public
     * @param {Object} user the current user
     * @param {Object} data the data to be updated
     * @returns {(Object|null)} the updated user resource
     */
    public updateUser = async (data: IUser): Promise<IUserModel> => {
        if (!data.id) {
            throw new AppError("Please specify the user resource you would like to modify");
        }
        if (data.username) {
            throw new AppError("Cannot change username");
        }
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, 10);
        }

        const updated = await UserModel.update(data, { where: { id: data.id } });
        if (!updated) {
            throw new AppError("Could not update user data");
        }
        return this.getUser(data.id);
    }

    /**
     * Creates new user record
     * @param {IUser} user
     */
    public addUser = async (user: IUser): Promise<IUserModel> => {
        user.password = bcrypt.hashSync(user.password, 10);
        const _user: IUser = await UserModel.create(user);
        if (!_user) {
            throw new AppError("Could not create new user record");
        }

        return this.getUser(_user.id);
    }

    /**
     * Deletes a user from the database (SOFT delete)
     * @param {number} id
     */
    public deleteUser = async (id: number): Promise<string> => {
        const deleted = await UserModel.destroy({
            where: { id },
        });

        if (!deleted) {
            throw new AppError("Could not delete user record");
        }

        return "User deleted";
    }
}
