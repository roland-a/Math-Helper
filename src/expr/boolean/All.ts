import { formula } from "../../equivalences/Formula"
import { Assign } from "../calculus/Assign"
import { Op } from "../Op"
import { And } from "./And"

export const All = new class extends Op{
    equivs = ()=> [
        formula(
            All.toExpr("x", "f"),
            And.toExpr(All.toExpr("x", "f"), Assign.toExpr("f", "x", "a"))
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "All"
    readonly generallyUnambigious = true
}