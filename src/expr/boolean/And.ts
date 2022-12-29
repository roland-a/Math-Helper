import { List } from "immutable"
import { Absorber } from "../../equivalences/Absorber"
import { Anhiliator } from "../../equivalences/Anhiliator"
import { Associate } from "../../equivalences/Associative"
import { Communative } from "../../equivalences/Communative"
import { Distribute } from "../../equivalences/Distribute"
import { formula } from "../../equivalences/Formula"
import { assertAllCanBe, precident } from "../helper"
import { Op } from "../Op"
import { Type } from "../Type"
import { Not } from "./Not"
import { Or } from "./Or"

export const And = new class extends Op{
    equivs = ()=> [
        new Associate(And),
        new Communative(And),
        new Absorber(And, true),
        new Anhiliator(And, false),
        new Distribute(Not, 0, And, Or),
        new Distribute(And, 0, Or),
        new Distribute(And, 1, Or),
        formula(
            And.toExpr("x", "x"),
            "x"
        ),
        formula(
            And.toExpr("x", Not.toExpr("x")),
            false
        )
    ]

    readonly cssName = "And"

    type(): Type{
        return Type.Bool
    }

    validate(children: List<Type>) {
        assertAllCanBe(Type.Bool, children, this.cssName)
    }

    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }

}