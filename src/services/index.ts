import Bottle from "bottlejs";
import Http from "./http";
import ApiQuestion from "./api/apiQuestion";

let bottle = new Bottle();

export default bottle;
bottle.service("Http", Http);
bottle.service("ApiQuestion", ApiQuestion, "Http");

declare module "bottlejs" {
    interface IContainer {
        ApiQuestion: ApiQuestion;
    }
}
