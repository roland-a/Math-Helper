import { formula } from "../../equivalences/Formula"
import { Assign } from "./Assign"
import { Op } from "../Op"
import { Or } from "../boolean/Or"
import { List } from "immutable"
import { assertCanBe } from "../helper"
import { Type } from "../Type"

export const Any = new class extends Op{
    equivs = ()=> [
        formula(
            Any.toExpr("x", "f"),
            Or.toExpr(Any.toExpr("x", "f"), Assign.toExpr("f", "x", "a"))
        ),
    ]

    readonly cssName = "Any"
    readonly generallyUnambigious = true

    type(): Type{
        return Type.Bool
    }

    validate(children: List<Type>) {
        assertCanBe(Type.Var, 0, children, this.cssName)
        assertCanBe(Type.Bool, 0, children, this.cssName)
    }
}