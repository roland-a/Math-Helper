import { formula } from "../../equivalences/Formula"
import { Simplifier } from "../../equivalences/Simplifier"
import { Derive } from "../calculus/Derive"
import { Integrate } from "../calculus/Integrate"
import { Op } from "../Op"
import { Mult } from "./Mult"

export const Neg = new class extends Op{
    equivs = ()=> [
        formula(
            Neg.toExpr("x"),
            Mult.toExpr(-1, "x")
        ),
        formula(
            Derive.toExpr(Neg.toExpr("f"), "x"),
            Neg.toExpr(Derive.toExpr("f", "x"))
        ),
        formula(
            Integrate.toExpr("a", "b", Neg.toExpr("f"), "x"),
            Neg.toExpr(Integrate.toExpr("a", "b", "f", "x")),
        ),
        new Simplifier(
            Neg,
            l=>-l
        ),
    ]

    readonly cssName = "Neg"

    childAmbigious(e: Op, i: number): boolean | null {
        return typeof e == "number" && e < 0
    }
}