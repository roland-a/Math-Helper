import { Absorber } from "../../equivalences/Absorber"
import { Anhiliator } from "../../equivalences/Anhiliator"
import { Associate } from "../../equivalences/Associative"
import { Communative } from "../../equivalences/Communative"
import { Distribute } from "../../equivalences/Distribute"
import { formula } from "../../equivalences/Formula"
import { precident } from "../helper"
import { Op } from "../Op"
import { And } from "./And"
import { Not } from "./Not"

export const Or = new class extends Op{
    equivs = () => [
        new Associate(Or),
        new Communative(Or),
        new Absorber(Or, false),
        new Anhiliator(Or, true),
        new Distribute(Not, 0, Or, And),
        new Distribute(Or, 0, And),
        new Distribute(Or, 1, And),
        formula(
            Or.toExpr("x", "x"),
            "x"
        ),
        formula(
            Or.toExpr("x", Not.toExpr("x")),
            true
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Or"

    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }
}