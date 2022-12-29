import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";


export const Pi = new class extends Op{
    readonly generallyUnambigious = true

    modifyUi(self: UIExpr): void {
        self.overridenContent = "π"
    }
}