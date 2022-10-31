import { Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { Distribute } from "../../equivalences/Distribute";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Add } from "../basic/Add";
import { Mult } from "../basic/Mult";
import { Pow } from "../basic/Pow";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { convert, ExprBase, Input } from "../ExprBase";
import { formula } from "../../equivalences/Formula";
import { Div } from "../basic/Div";
import { Sub } from "../basic/Sub";
import { Limit } from "./Limit";
import { Assign } from "./Assign";
import { isConst } from "../helper";

let consts = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected instanceof Derive)) return null

        let fn = selected.get(0)
        let varr = selected.get(1)

        if (typeof varr != "string") return null

        if (!isConst(fn, varr)) return null

        return 0
    }
}

export class Derive extends ExprBase{
    static equivs = ()=> [
        consts,
        formula(
            new Derive("f", "x"),
            new Limit("h", 0, new Div(new Sub(new Assign("f", "x", new Add("x", "h")), "f"), "h"))
        ),
        formula(
            new Derive(new Assign("f", "x", "g"), "x"),
            new Mult(new Assign(new Derive("f", "x"), "x", "g"), new Derive("g", "x"))
        ),
    ]

    readonly generallyUnambigious = true

    readonly cssName = "Derive"

    constructor(func: Expr, varr: TypeBox|string){
        super([func, varr])

        if (!(typeof varr == "string" || varr instanceof TypeBox)) throw new Error()

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        if (e instanceof Assign) return true

        if (e instanceof Pow) return true

        if (i==0) return null

        return false
    }
}