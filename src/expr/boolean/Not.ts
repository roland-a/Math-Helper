import { List } from "immutable"
import { formula } from "../../equivalences/Formula"
import { assertAllCanBe } from "../helper"
import { Op } from "../Op"
import { Type } from "../Type"

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

    readonly cssName = "Not"

    type(): Type{
        return Type.Bool
    }

    validate(children: List<Type>) {
        assertAllCanBe(Type.Bool, children, this.cssName)
    }
}