import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { Op } from "../Op";
import { Add } from "./Add";
import { Mult } from "./Mult";
import { Pow } from "./Pow";

export const Div = new class extends Op{
    readonly generallyUnambigious = true

    equivs = ()=> [
        formula(
            Div.toExpr("x", 1),
            "x"
        ),
        formula(
            Div.toExpr("a", "b"),
            Mult.toExpr("a", Pow.toExpr("b", -1))
        ),
        formula(
            Div.toExpr("x", "x"),
            1
        ),
        formula(
            Div.toExpr("a", Div.toExpr("b", "c")),
            Div.toExpr(Mult.toExpr("a", "c"), "b")
        ),
        formula(
            Add.toExpr(Div.toExpr("a", "c"), Div.toExpr("b", "c")),
            Div.toExpr(Add.toExpr("a", "b"), "c"),
        ),
        formula(
            Mult.toExpr(Div.toExpr("a", "b"), Div.toExpr("c", "d")),
            Div.toExpr(Mult.toExpr("a", "c"), Mult.toExpr("b", "d")),
        ),
        new Simplifier(Div, (l,r)=>l/r),
    ]

    readonly cssName = "Div"

    childAmbigious(e: Op, i: number): boolean | null {
        return e == Div
    }
}
