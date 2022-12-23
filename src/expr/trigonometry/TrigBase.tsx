import { pool } from "../../misc/Pooler";
import { PreJSX } from "../../ui/PreJsx";
import { DisplayMod, Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";

export abstract class TrigBase extends ExprBase{
    readonly generallyUnambigious = true

    constructor(e: Expr){
        super([e])

        if (this.children.some(c=>c.type=="boolean")) throw new Error()
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return true
    }
    
    toPreJSX(): PreJSX {
        return new PreJSX(
            this,
            "Trig",
            [
                new PreJSX(null, "", this.cssName.toLocaleLowerCase()),
                this.get(0).toPreJSX().setNthChild(0)
            ]
        )
    }
}