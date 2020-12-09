import * as authActions from "src/store/auth/actions";
import * as userActions from "src/store/users/actions";
import * as mainActions from "src/store/main/actions";

type InferValueTypes<T> = T extends { [key: string]: infer U } ? U : never;
export type ActionTypesInfer<T extends { [key: string]: any }> = ReturnType<InferValueTypes<T>>;

export type allActionsTypes = ActionTypesInfer<typeof authActions | typeof userActions | typeof mainActions>;
