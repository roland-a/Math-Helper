import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { TypeBox } from "../TypeBox";
import { DisplayMod, Expr } from "../Expr";
import { convert, ExprBase, Input } from "../ExprBase";

import { formula } from "../../equivalences/Formula";
import { Mult } from "../basic/Mult";
import { Sub } from "../basic/Sub";
import { Div } from "../basic/Div";
import { Assign } from "./Assign";
import { Derive } from "./Derive";
import { PreJSX } from "../../ui/PreJsx";

export class Integrate extends ExprBase{
    readonly cssName = "Integrate"

    static equivs = ()=> [
        formula(
            new Integrate("a", "b", new Derive("f", "x"), "x"),
            new Sub(new Assign("f", "x", "a"), new Assign("f", "x", "b"))
        ),
        formula(
            new Integrate("a", "b", new Mult(new Derive("u", "x"), "v"), "x"),
            new Sub(
                new Integrate("a", "b", new Derive(new Mult("u", "v"), "x"), "x"),
                new Integrate("a", "b", new Mult("u", new Derive("v", "x"), "x"), "x")
            )
        )
    ]

    constructor(a: Expr, b:Expr, func: Expr, varr: TypeBox|string){
        super([a, b, func, varr])

        if (!(typeof varr == "string" || varr instanceof TypeBox)) throw new Error()

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        if (i==0||i==1) return false

        return false
    }

    toPreJSX(): PreJSX {
        let result = new PreJSX(
            this,
            this.cssName,
            [
                new PreJSX(
                    this,
                    "",
                    [
                        this.get(0).toPreJSX().setNthChild(0),
                        this.get(1).toPreJSX().setNthChild(1)
                    ]
                ),
                this.get(2).toPreJSX().setNthChild(2),
                this.get(3).toPreJSX().setNthChild(3)
            ]
        )

        if (this.get(0) == this.get(3) && this.get(1) == 0){
            result.get(0).override("")
        }
    
        return result
    }
}