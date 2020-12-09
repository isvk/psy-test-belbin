import { Record } from "immutable";
import { TStoreUser } from "src/store/users/reducer";
import { IReadApiUser } from "src/services/api/apiUser";

export interface IUser {
    id: number;
    username: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    is_active: boolean;
    last_login?: Date | undefined;
    is_superuser?: boolean;
}

export const initialUser: IUser = {
    id: 0,
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    is_active: false,
    last_login: undefined,
    is_superuser: false,
};

export const labelsForAttrUser: { field: keyof IUser; text: string; weight: number }[] = [
    { field: "id", text: "ID", weight: 5 },
    { field: "username", text: "Логин", weight: 15 },
    { field: "first_name", text: "Имя", weight: 15 },
    { field: "last_name", text: "Фамилия", weight: 15 },
    { field: "is_active", text: "Active", weight: 8 },
    { field: "is_superuser", text: "Super", weight: 8 },
    { field: "last_login", text: "Последнее посещение", weight: 22 },
];

export const getLabelFromLabelsForAttrUser = (field: keyof IUser) => {
    return labelsForAttrUser.find((label) => label.field === field);
};

export interface IErrorValidation {
    field: string;
    code: string;
    text?: string;
    ignoreFirstTry?: boolean;
}

export interface IValidation {
    username: (username?: string) => IErrorValidation[];
    password: (password?: string) => IErrorValidation[];
    first_name: (first_name?: string) => IErrorValidation[];
    last_name: (last_name?: string) => IErrorValidation[];
}

export const validation: IValidation = {
    username: (username) => {
        let result: IErrorValidation[] = [];

        if (!username) {
            result.push({ field: "username", code: "required", text: "Введите логин" });
        } else if (username.length > 150) {
            result.push({
                field: "username",
                code: "maxLength",
                text: "Логин должны быть не больше 150 символов",
            });
        } else {
            let invalidCharacters = username
                .match(/[^\w.@+-]+/g)
                ?.join("")
                .split("")
                .map((character) => (character === " " ? "пробел" : character))
                .map((character) => (character === "," ? "запятой" : character));

            let uniqueInvalidCharacters = Array.from(new Set(invalidCharacters));

            if (uniqueInvalidCharacters.length > 0) {
                result.push({
                    field: "username",
                    code: "invalidCharacters",
                    text: "Логин не должно содержать: " + uniqueInvalidCharacters.join(", "),
                    ignoreFirstTry: true,
                });
            }
        }

        return result;
    },
    password: (password) => {
        let result: IErrorValidation[] = [];

        if (!password) {
            result.push({ field: "password", code: "required", text: "Введите пароль" });
        } else if (password.length < 8) {
            result.push({ field: "password", code: "minLength", text: "Пароль должен быть не меньше 8 символов" });
        } else if (password.length > 128) {
            result.push({ field: "password", code: "maxLength", text: "Пароль должен быть не больше 128 символов" });
        } else {
            if (password.search(/[A-Z]+/g) < 0) {
                result.push({
                    field: "password",
                    code: "requiredCapitalLetter",
                    text: "В пароле должна использоваться хотя бы одна заглавная английская буква",
                });
            }

            if (password.search(/[\d]+/g) < 0) {
                result.push({
                    field: "password",
                    code: "requiredNumber",
                    text: "В пароле должна использоваться хотя бы одна цифра",
                });
            }
        }

        return result;
    },
    first_name: (first_name) => {
        let result: IErrorValidation[] = [];

        if (first_name && first_name.length > 30) {
            result.push({ field: "first_name", code: "maxLength", text: "Имя должено быть не больше 30 символов" });
        }
        return result;
    },
    last_name: (last_name) => {
        let result: IErrorValidation[] = [];

        if (last_name && last_name.length > 150) {
            result.push({ field: "last_name", code: "maxLength", text: "Фамилия должена быть не больше 150 символов" });
        }
        return result;
    },
};

export const filterByPartUsername = (users: Readonly<TStoreUser>, searchWord: string) => {
    const reg = new RegExp(searchWord.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i");

    return users.filter((user) => user.username.search(reg) !== -1);
};

export const sortByField = (users: Readonly<TStoreUser>, field: keyof IUser, isAscending: boolean) => {
    return users.sort((a, b) => {
        let result = 0;

        if (a[field] !== initialUser[field] && b[field] === initialUser[field]) result = 1;
        if (a[field] === initialUser[field] && b[field] !== initialUser[field]) result = -1;

        if (a[field] !== initialUser[field] && b[field] !== initialUser[field]) {
            switch (field) {
                case "last_login":
                    if (a[field]!.getTime() > b[field]!.getTime()) result = 1;
                    if (a[field]!.getTime() < b[field]!.getTime()) result = -1;
                    break;
                default:
                    if (a[field]! > b[field]!) result = 1;
                    if (a[field]! < b[field]!) result = -1;
                    break;
            }
        }

        if (result !== 0) {
            return isAscending ? result : -result;
        }
        return 0;
    });
};

export default class User extends Record(initialUser) {
    constructor(props?: IReadApiUser) {
        let last_login: Date | undefined = undefined;

        if (props?.last_login) {
            last_login = new Date(props?.last_login);
        }

        super({ ...props, last_login });
    }

    errorsValidationByFields(fields: (keyof IValidation & keyof IUser)[]) {
        let result: IErrorValidation[] = [];

        fields.forEach((field) => {
            if (field in this && field in validation) {
                result.push(...validation[field](this[field]));
            }
        });

        return result;
    }

    getLastLoginInFormat() {
        if (this.last_login) {
            return this.last_login.toLocaleDateString("ru-RU", {
                minute: "2-digit",
                hour: "2-digit",
                year: "numeric",
                month: "numeric",
                day: "numeric",
            });
        }
    }
}
