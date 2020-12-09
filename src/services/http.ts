import { IHttp } from "./IHttp";

export default class Http implements IHttp {
    get = (url: string, data?: object) => {
        return this.request("GET", url, data);
    };

    post = (url: string, data?: object) => {
        return this.request("POST", url, data);
    };

    put = (url: string, data?: object) => {
        return this.request("PUT", url, data);
    };

    patch = (url: string, data?: object) => {
        return this.request("PATCH", url, data);
    };

    delete = (url: string, data?: object) => {
        return this.request("DELETE", url, data);
    };

    request = (method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET", url: string, data?: {}) => {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        const token = localStorage.getItem("token");

        return fetch("https://emphasoft-test-assignment.herokuapp.com" + url, {
            method,
            headers: token ? { ...headers, Authorization: "Token " + token } : headers,
            body: method !== "GET" ? JSON.stringify(data) : undefined,
        }).then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        });
    };
}
