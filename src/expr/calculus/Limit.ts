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
import { convert, ExprBase, Input } from "../ExprBase";
import { formula } from "../../equivalences/Formula";
import { Assign } from "./Assign";



export class Limit extends ExprBase{
    readonly cssName = "Limit"

    readonly cssGroupings = [[0,1]] as [int,int][];

    static equivs = ()=> [
        formula(
            new Limit("x", "c", "f"),
            new Assign("f", "x", "c")
        ),
        new Distribute(Limit, 2, Add),
        new Distribute(Limit, 2, Mult),
        new Distribute(Limit, 2, Div),
        new Distribute(Limit, 2, Pow),
        new Distribute(Limit, 2, Abs),
    ]

    constructor(varr: TypeBox|string, target: Expr, func: Expr){
        super([varr, target, func])

        if (!(typeof varr == "string" || varr instanceof TypeBox)) throw new Error()

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        if (Limit.hasVar(target, varr)) throw new Error()

        return pool(this)
    }

    private static hasVar(e: Expr, v: Expr): boolean{
        if (e == v) return true

        return e.children.some(c=>this.hasVar(c, v))
    }

    childAmbigious(e: Expr, i: number): boolean|null {
        if (i == 2) return null

        return false
    }
}
