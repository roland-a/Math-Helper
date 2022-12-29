import { List, Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { Distribute } from "../../equivalences/Distribute";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Add } from "../basic/Add";
import { Mult } from "../basic/Mult";
import { Pow } from "../basic/Pow";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { Op } from "../Op";
import { formula } from "../../equivalences/Formula";
import { Div } from "../basic/Div";
import { Sub } from "../basic/Sub";
import { Limit } from "./Limit";
import { Assign } from "./Assign";
import { assertCanBe, isConst } from "../helper";
import { Num } from "../basic/Num";
import { Type } from "../Type";

let consts = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected.is(Derive))) return null

        let fn = selected.get(0)
        let varr = selected.get(1)

        if (typeof varr != "string") return null

        if (!isConst(fn, varr)) return null

        return new Num(0).toExpr()
    }
}

export const Derive = new class extends Op{
    equivs = ()=> [
        consts,
        formula(
            Derive.toExpr("f", "x"),
            Limit.toExpr("h", 0, Div.toExpr(Sub.toExpr(Assign.toExpr("f", "x", Add.toExpr("x", "h")), "f"), "h"))
        ),
        formula(
            Derive.toExpr(Assign.toExpr("f", "x", "g"), "x"),
            Mult.toExpr(Assign.toExpr(Derive.toExpr("f", "x"), "x", "g"), Derive.toExpr("g", "x"))
        ),
    ]

    readonly generallyUnambigious = true
    readonly cssName = "Derive"

    type(): Type{
        return Type.Num
    }

    validate(children: List<Type>) {
        assertCanBe(Type.Num, 0, children, this.cssName)
        assertCanBe(Type.Var, 1, children, this.cssName)
    }

    childAmbigious(e: Op, i: number): boolean | null {
        if (e == Assign) return true

        if (e == Pow) return true

        if (i==0) return null

        return false
    }
}