import Bottle from "bottlejs";
import Http from "./http";
import ApiAuth from "./api/apiAuth";
import ApiUser from "./api/apiUser";

let bottle = new Bottle();

export default bottle;
bottle.service("Http", Http);
bottle.service("ApiAuth", ApiAuth, "Http");
bottle.service("ApiUser", ApiUser, "Http");

declare module "bottlejs" {
    interface IContainer {
        ApiAuth: ApiAuth;
        ApiUser: ApiUser;
    }
}
