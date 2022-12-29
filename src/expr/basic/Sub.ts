import { formula } from "../../equivalences/Formula"
import { Simplifier } from "../../equivalences/Simplifier"
import { Class } from "../../misc/Class"
import { int } from "../../misc/Int"
import { pool } from "../../misc/Pooler"
import { Derive } from "../calculus/Derive"
import { Integrate } from "../calculus/Integrate"
import { precident } from "../helper"
import { Expr } from "../Expr"
import { Op } from "../Op"
import { Add } from "./Add"
import { Neg } from "./Neg"

export const Sub = new class extends Op{
    equivs = ()=> [
        formula(
            Sub.toExpr("x", "y"),
            Add.toExpr("x", Neg.toExpr("y"))
        ),
        formula(
            Sub.toExpr("x", 0),
            "x"
        ),
        formula(
            Sub.toExpr("x", "x"),
            0
        ),
        formula(
            Derive.toExpr(Sub.toExpr("f", "g"), "x"),
            Sub.toExpr(Derive.toExpr("f", "x"), Derive.toExpr("g", "x"))
        ),
        formula(
            Integrate.toExpr("a", "b", Sub.toExpr("f", "g"), "x"),
            Sub.toExpr(Integrate.toExpr("a", "b", "f", "x"), Integrate.toExpr("a", "b", "g", "x"))
        ),
        new Simplifier(
            Sub,
            (l,r)=>l-r
        )
    ]

    readonly cssName = "Sub"

    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }
}

