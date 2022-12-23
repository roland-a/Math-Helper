import { formula } from "../../equivalences/Formula"
import { int } from "../../misc/Int"
import { pool } from "../../misc/Pooler"
import { PreJSX } from "../../ui/PreJsx"
import { DisplayMod, Expr } from "../Expr"
import { ExprBase, Input } from "../ExprBase"
import { Div } from "./Div"
import { Pow } from "./Pow"

export class Roots extends ExprBase{
    static equivs = ()=>[
        formula(
            new Roots("n", "x"),
            new Pow("x", new Div(1,"n"))
        )
    ]

    readonly generallyUnambigious = true

    readonly cssGroupings: [int,int][] = [[1,1]]

    readonly cssName = "Roots"

    constructor(index: Expr, radicant: Expr) { 
        super([index, radicant]) 

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    toPreJSX(): PreJSX {
        let result = super.toPreJSX()

        if (this.get(0) == 2){
            result.get(0).override("")
        }

        return result;
    }   
}