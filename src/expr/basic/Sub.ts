import { formula } from "../../equivalences/Formula"
import { Simplifier } from "../../equivalences/Simplifier"
import { Class } from "../../misc/Class"
import { int } from "../../misc/Int"
import { pool } from "../../misc/Pooler"
import { Derive } from "../calculus/Derive"
import { Integrate } from "../calculus/Integrate"
import { Expr } from "../Expr"
import { ExprBase, Input } from "../ExprBase"
import { precident } from "../precidents"
import { Unary } from "../Unary"
import { Add } from "./Add"
import { Neg } from "./Neg"

export class Sub extends ExprBase{
    static equivs = ()=> [
        formula(
            new Sub("x", "y"),
            new Add("x", new Neg("y"))
        ),
        formula(
            new Sub("x", 0),
            "x"
        ),
        formula(
            new Sub("x", "x"),
            0
        ),
        formula(
            new Derive(new Sub("f", "g"), "x"),
            new Sub(new Derive("f", "x"), new Derive("g", "x"))
        ),
        formula(
            new Integrate("a", "b", new Sub("f", "g"), "x"),
            new Sub(new Integrate("a", "b", "f", "x"), new Integrate("a", "b", "g", "x"))
        ),
        new Simplifier(
            Sub,
            (l,r)=>l-r
        )
    ]

    readonly cssName = "Sub"

    constructor(left: Expr, right:Expr){ 
        super([left, right])

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }
    
    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }
}

