import { formula } from "../../equivalences/Formula"
import { pool } from "../../misc/Pooler"
import { Assign } from "../calculus/Assign"
import { Expr } from "../Expr"
import { Op  } from "../Op"
import { TypeBox } from "../TypeBox"
import { Or } from "./Or"

export const Any = new class extends Op{
    equivs = ()=> [
        formula(
            Any.toExpr("x", "f"),
            Or.toExpr(Any.toExpr("x", "f"), Assign.toExpr("f", "x", "a"))
        ),
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Any"

    readonly generallyUnambigious = true
}