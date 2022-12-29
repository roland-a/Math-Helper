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

    childAmbigious(e: Op, i: number): boolean|null {
        if (i == 2) return null

        return false
    }
}
