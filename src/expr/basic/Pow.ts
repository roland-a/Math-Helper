import { Distribute } from "../../equivalences/Distribute";
import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { Derive } from "../calculus/Derive";
import { Op } from "../Op";

import { Add } from "./Add";
import { Div } from "./Div";
import { Mult } from "./Mult";
import { Sub } from "./Sub";

export const Pow = new class extends Op{
    equivs = ()=>[
        formula(
            Pow.toExpr("x", 0),
            1
        ),
        formula(
            Pow.toExpr("x", 1),
            "x"
        ),
        formula(
            Pow.toExpr(1, "x"),
            1
        ),
        formula(
            Pow.toExpr(Pow.toExpr("x", "y"), "z"),
            Pow.toExpr("x", Mult.toExpr("y", "z"))
        ),
        new Distribute(Pow, 1, Add, Mult),
        new Distribute(Pow, 0, Mult),
        formula(
            Derive.toExpr(Pow.toExpr("x", "c"), "x"),
            Mult.toExpr(Div.toExpr(1, "c"), Pow.toExpr("x", Sub.toExpr("c", 1)))
        ),
        formula(
            Pow.toExpr("x", "c"),
            Derive.toExpr(Mult.toExpr(Div.toExpr(1, Add.toExpr("c", 1)), Pow.toExpr("x", Add.toExpr("c", 1))), "x"),
        ),
        new Simplifier(Pow, (l,r)=>Math.pow(l, r)),
    ]

    readonly generallyUnambigious = true

    readonly cssName = "Pow"

    childAmbigious(e: Op, i: number): boolean | null {
        if (e == Pow) return true
        if (i == 1) return false

        return !e.generallyUnambigious || e == Div
    }
}