import { Record } from "immutable";

export interface IRole {
    id: number;
    name: string;
    characteristic: string;
    functionality: string;
}

export const initialRole: IRole = {
    id: 0,
    name: "",
    characteristic: "",
    functionality: "",
};

export default class Role extends Record(initialRole) {}
