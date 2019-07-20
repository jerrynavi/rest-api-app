import { IBaseInterface } from "../baseInterface";

export interface IUser extends IBaseInterface {
    // type any is used to prevent error on validation level
    id: any;
    username: any;
    first_name: any;
    last_name: any;
    email: any;
    password: any;
    phone_number: any;
    gender: any;
    date_of_birth: any;
    email_verification_code: any;
}
