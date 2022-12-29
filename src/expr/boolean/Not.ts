import { formula } from "../../equivalences/Formula"
import { pool } from "../../misc/Pooler"
import { Expr } from "../Expr"
import { Op } from "../Op"

export const Not = new class extends Op{
    equivs = ()=> [
        formula(
            Not.toExpr(Not.toExpr("x")),
            "x"
        ),
        formula(
            Not.toExpr(true),
            false
        ),
        formula(
            Not.toExpr(false),
            true
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Not"
}