import { DisplayMod, Expr } from "../Expr";
import { ExprBase } from "../ExprBase";


export const Pi = new class extends ExprBase{
    readonly generallyUnambigious = true

    constructor(){
        super([])
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return false
    }

    display(d: DisplayMod): JSX.Element {
        return d.wrap(
            <span>π</span>
        )
    }
}