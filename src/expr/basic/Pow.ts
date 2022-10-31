import { Distribute } from "../../equivalences/Distribute";
import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { Class } from "../../misc/Class";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Derive } from "../calculus/Derive";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";

import { precident as ambigiousByPrecident, precident } from "../precidents";
import { Add } from "./Add";
import { Div } from "./Div";
import { Mult } from "./Mult";
import { Sub } from "./Sub";

export class Pow extends ExprBase{
    static equivs = ()=>[
        formula(
            new Pow("x", 0),
            1
        ),
        formula(
            new Pow("x", 1),
            "x"
        ),
        formula(
            new Pow(1, "x"),
            1
        ),
        formula(
            new Pow(new Pow("x", "y"), "z"),
            new Pow("x", new Mult("y", "z"))
        ),
        new Distribute(Pow, 1, Add, Mult),
        new Distribute(Pow, 0, Mult),
        formula(
            new Derive(new Pow("x", "c"), "x"),
            new Mult(new Div(1, "c"), new Pow("x", new Sub("c", 1)))
        ),
        formula(
            new Pow("x", "c"),
            new Derive(new Mult(new Div(1, new Add("c", 1)), new Pow("x", new Add("c", 1))), "x"),
        ),
        new Simplifier(Pow, (l,r)=>Math.pow(l, r)),
    ]

    readonly generallyUnambigious = true

    readonly cssName = "Pow"

    constructor(left: Expr, right: Expr) { 
        super([left, right])
        
        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        if (e instanceof Pow) return true
        if (i == 1) return false

        return !e.generallyUnambigious || e instanceof Div
    }
}