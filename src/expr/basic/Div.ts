import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";
import { Add } from "./Add";
import { Mult } from "./Mult";
import { Pow } from "./Pow";

export class Div extends ExprBase{
    readonly generallyUnambigious = true

    static equivs = ()=> [
        formula(
            new Div("x", 1),
            "x"
        ),
        formula(
            new Div("a", "b"),
            new Mult("a", new Pow("b", -1))
        ),
        formula(
            new Div("x", "x"),
            1
        ),
        formula(
            new Div("a", new Div("b", "c")),
            new Div(new Mult("a", "c"), "b")
        ),
        formula(
            new Add(new Div("a", "c"), new Div("b", "c")),
            new Div(new Add("a", "b"), "c"),
        ),
        formula(
            new Mult(new Div("a", "b"), new Div("c", "d")),
            new Div(new Mult("a", "c"), new Mult("b", "d")),
        ),
        new Simplifier(Div, (l,r)=>l/r),
    ]

    readonly cssName = "Div"

    constructor(left: Expr, right: Expr) { 
        super([left, right]) 

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return e instanceof Div
    }
}

function Formula(arg0: Div, arg1: number) {
    throw new Error("Function not implemented.");
}
