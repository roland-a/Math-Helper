import { formula } from "../../equivalences/Formula"
import { Assign } from "./Assign"
import { Op } from "../Op"
import { And } from "../boolean/And"
import { List } from "immutable"
import { assertCanBe } from "../helper"
import { Type } from "../Type"

export const All = new class extends Op{
    equivs = ()=> [
        formula(
            All.toExpr("x", "f"),
            And.toExpr(All.toExpr("x", "f"), Assign.toExpr("f", "x", "a"))
        )
    ]

    readonly cssName = "All"
    readonly generallyUnambigious = true
    

    type(): Type{
        return Type.Bool
    }

    validate(children: List<Type>) {
        assertCanBe(Type.Var, 0, children, this.cssName)
        assertCanBe(Type.Bool, 0, children, this.cssName)
    }
}