import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";


export const Infinity = new class extends Op{
    readonly generallyUnambigious = true

    modifyUi(self: UIExpr): void {
        self.overridenContent = "∞"
    }
}