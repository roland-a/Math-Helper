import { Distribute } from "../../equivalences/Distribute";

import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { Unary } from "../Unary";
import { Mult } from "./Mult";

export class Abs extends Unary{
    static equivs = ()=> [
        new Distribute(Abs, 0, Mult),
        new Simplifier(Abs, a=>Math.abs(a)),
    ]

    readonly cssName = "Abs"
    readonly generallyUnambigious = true

    constructor(inner: Expr) { 
        super(inner)

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }
}