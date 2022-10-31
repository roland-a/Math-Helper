import { formula } from "../../equivalences/Formula"
import { int } from "../../misc/Int"
import { pool } from "../../misc/Pooler"
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

    display(d: DisplayMod): JSX.Element {
        if (this.get(0) == 2){
            return d.wrap(
                <span className={this.constructor.name}>
                    <span></span>
                    <span>{this.get(1).display(d.next(1, this.get(1)))}</span>
                </span>
            )
        }

        return super.display(d)
    }   
}