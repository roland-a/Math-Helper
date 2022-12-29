import { Distribute } from "../../equivalences/Distribute";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Abs } from "../basic/Abs";
import { Add } from "../basic/Add";
import { Div } from "../basic/Div";
import { Mult } from "../basic/Mult";
import { Pow } from "../basic/Pow";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { Op } from "../Op";
import { formula } from "../../equivalences/Formula";
import { Assign } from "./Assign";
import { Type } from "../Type";
import { List } from "immutable";
import { assertCanBe } from "../helper";



export const Limit = new class extends Op{
    readonly cssName = "Limit"

    readonly cssGroupings = [[0,1]] as [int,int][];

    equivs = ()=> [
        formula(
            Limit.toExpr("x", "c", "f"),
            Assign.toExpr("f", "x", "c")
        ),
        new Distribute(Limit, 2, Add),
        new Distribute(Limit, 2, Mult),
        new Distribute(Limit, 2, Div),
        new Distribute(Limit, 2, Pow),
        new Distribute(Limit, 2, Abs),
    ]

    private static hasVar(e: Expr, v: Expr): boolean{
        if (e == v) return true

        return e.children.some(c=>this.hasVar(c, v))
    }

    type(): Type{
        return Type.Num
    }

    validate(children: List<Type>) {
        assertCanBe(Type.Var, 0, children, this.cssName)
        assertCanBe(Type.Num, 1, children, this.cssName)
        assertCanBe(Type.Num, 2, children, this.cssName)
    }

    childAmbigious(e: Op, i: number): boolean|null {
        if (i == 2) return null

        return false
    }
}
