import { pool } from "../../misc/Pooler";
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
    
    display(d: DisplayMod): JSX.Element {
        return d.wrap(
            <span className="Trig">
                <>{this.cssName.toLowerCase()}</>
                <>{this.get(0).display(d.next(0, this.get(0)))}</>
            </span>
        )
    }
}