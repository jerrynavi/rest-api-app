import Sequelize, { Model } from "sequelize";
import { DB } from "../../shared/database";
import { logger } from "../../utils/logger";
import bcrypt from "bcrypt";
import withPagination from "sequelize-cursor-pagination";

export class UserModel extends Model { }
UserModel.init(
    {
        username: {
            type: Sequelize.STRING,
            unique: {
                name: "username",
                msg: "An account already exists with this username",
            },
            validate: {
                is: /^[a-zA-Z0-9._-]{3,16}$/i,
                notEmpty: {
                    msg: "Username cannot be empty",
                },
            },
        },
        email: {
            type: Sequelize.STRING,
            unique: {
                name: "email",
                msg: "An account already exists with this email address.",
            },
            validate: {
                isEmail: { msg: "Please check this is a valid email" },
                notEmpty: { msg: "email can't be empty" },
            },
        },
        phone_number: {
            type: Sequelize.STRING,
            validate: {
                isNumeric: {
                    msg: "Please confirm phonenumber contains valid characters",
                },
            },
        },
        password: {
            type: Sequelize.STRING(255),
        },
        first_name: {
            type: Sequelize.STRING,
            validate: {
                min: 2,
            },
        },
        last_name: {
            type: Sequelize.STRING,
            validate: {
                min: 2,
            },
        },
        gender: {
            type: Sequelize.STRING,
        },
        date_of_birth: {
            type: Sequelize.STRING,
        },
        verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize: DB,
        modelName: "users",
    },
);

const syncOptions: any = { alter: true };
const paginationOptions: any = {
    methodName: "paginate",
    primaryKeyField: "id",
};

// force: true will drop the table if it already exists
UserModel.sync(syncOptions).then(async () => {
    logger.info("Users table migrated");
    // Table created

    const user = await UserModel.findOne({ where: {username: "test"}});
    if (user) {
        logger.info("User `test` already exists. Application runs fine");
        return;
    }
    logger.info("Creating default user");
    const hashed = bcrypt.hashSync("pass1234", 10);
    const newUser = await UserModel.create({
        username: "test",
        password: hashed,
        email: "test@email.com",
        gender: "female",
    });
    if (newUser) {
        logger.info("Default user created with the following credentials:\n\ntest\npass1234");
        return;
    }
});

withPagination(paginationOptions)(UserModel);
