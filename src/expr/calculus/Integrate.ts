import { Op } from "../Op";

import { formula } from "../../equivalences/Formula";
import { Mult } from "../basic/Mult";
import { Sub } from "../basic/Sub";
import { Div } from "../basic/Div";
import { Assign } from "./Assign";
import { Derive } from "./Derive";
import { UIExpr } from "../../ui/UiExpr";

export const Integrate = new class extends Op{
    readonly cssName = "Integrate"

    equivs = ()=> [
        formula(
            Integrate.toExpr("a", "b", Derive.toExpr("f", "x"), "x"),
            Sub.toExpr(Assign.toExpr("f", "x", "a"), Assign.toExpr("f", "x", "b"))
        ),
        formula(
            Integrate.toExpr("a", "b", Mult.toExpr(Derive.toExpr("u", "x"), "v"), "x"),
            Sub.toExpr(
                Integrate.toExpr("a", "b", Derive.toExpr(Mult.toExpr("u", "v"), "x"), "x"),
                Integrate.toExpr("a", "b", Mult.toExpr("u", Derive.toExpr("v", "x"), "x"), "x")
            )
        )
    ]

    childAmbigious(e: Op, i: number): boolean | null {
        if (i==0||i==1) return false

        return false
    }
}