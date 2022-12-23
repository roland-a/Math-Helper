import { PreJSX } from "../../ui/PreJsx";
import { DisplayMod, Expr } from "../Expr";
import { ExprBase } from "../ExprBase";


export const Pi = new class extends ExprBase{
    readonly generallyUnambigious = true

    constructor(){
        super([])
    }

    toPreJSX(): PreJSX {
        return new PreJSX(
            this,
            "Pi",
            "π"
        )
    }
}