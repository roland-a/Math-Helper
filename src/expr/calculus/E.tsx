import { formula } from "../../equivalences/Formula";
import { UIExpr } from "../../ui/UiExpr";
import { Add } from "../basic/Add";
import { Div } from "../basic/Div";
import { Pow } from "../basic/Pow";
import { Expr } from "../Expr";
import { Op } from "../Op";
import { Derive } from "./Derive";
import { Infinity } from "./Infinity";
import { Limit } from "./Limit";

export const E = new class extends Op{
    readonly generallyUnambigious = true

    equivs = ()=> {
        return [
            formula(
                E,
                Limit.toExpr("n", Infinity, Pow.toExpr(Add.toExpr(1, Div.toExpr(1, "n")), "n"))
            ), 
            formula(
                Derive.toExpr(Pow.toExpr(E, "x"), "x"),
                Pow.toExpr(E, "x")
            )
        ]
    }

    modifyUi(self: UIExpr): void {
        self.overridenContent = "e"
    }
}