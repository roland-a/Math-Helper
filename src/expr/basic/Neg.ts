import { Distribute } from "../../equivalences/Distribute"
import { formula } from "../../equivalences/Formula"
import { Simplifier } from "../../equivalences/Simplifier"
import { pool } from "../../misc/Pooler"
import { Derive } from "../calculus/Derive"
import { Integrate } from "../calculus/Integrate"
import { Expr } from "../Expr"
import { Input } from "../ExprBase"
import { Unary } from "../Unary"
import { Mult } from "./Mult"

export class Neg extends Unary{
    static equivs = ()=> [
        formula(
            new Neg("x"),
            new Mult(-1, "x")
        ),
        formula(
            new Derive(new Neg("f"), "x"),
            new Neg(new Derive("f", "x"))
        ),
        formula(
            new Integrate("a", "b", new Neg("f"), "x"),
            new Neg(new Integrate("a", "b", "f", "x")),
        ),
        new Simplifier(
            Neg,
            l=>-l
        ),
    ]

    readonly cssName = "Neg"

    constructor(inner: Expr){
        super(inner)

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    innerAmbigious(inner: Expr): boolean {
        return inner instanceof Number
    }


}