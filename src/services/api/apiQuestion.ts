import { IHttp } from "src/services/IHttp";
import User, { IUser } from "src/models/user";

export interface IReadApiUser {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    last_login?: string;
    is_superuser?: boolean;
}

export interface IWriteApiUser {
    username?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    is_active?: boolean;
}

export const initialWriteApiUser: IWriteApiUser = {
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: false,
};

export default class ApiUser {
    constructor(private http: IHttp, private url: string = "/api/v1/users") {}

    userToWriteApiUser = (user: User): IWriteApiUser => {
        let result: IWriteApiUser = {};
        let userObject: IUser = user.toJS();

        for (const [key, value] of Object.entries(userObject)) {
            /*If the username or password is empty, then they are not sent to the server*/
            if (key in initialWriteApiUser && !((key === "username" || key === "password") && value === "")) {
                result = { ...result, [key]: value };
            }
        }

        return result;
    };

    loadUsers = () => {
        return this.http.get(this.url + "/").then((response: IReadApiUser[]) => {
            return response.map((user) => new User(user));
        });
    };

    loadUser = (id: User["id"]) => {
        return this.http.get(this.url + "/" + id + "/").then((response: IReadApiUser) => {
            return new User(response);
        });
    };

    createUser = (user: User) => {
        return this.http.post(this.url + "/", this.userToWriteApiUser(user)).then((response: IReadApiUser) => {
            return new User(response);
        });
    };

    updateUser = (user: User) => {
        return this.http
            .patch(this.url + "/" + user.id + "/", this.userToWriteApiUser(user))
            .then((response: IReadApiUser) => {
                return new User(response);
            });
    };
}
