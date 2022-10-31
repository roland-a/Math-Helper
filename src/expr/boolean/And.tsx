import { Absorber } from "../../equivalences/Absorber"
import { Anhiliator } from "../../equivalences/Anhiliator"
import { Associate } from "../../equivalences/Associative"
import { Communative } from "../../equivalences/Communative"
import { Distribute } from "../../equivalences/Distribute"
import { formula } from "../../equivalences/Formula"
import { pool } from "../../misc/Pooler"
import { Expr } from "../Expr"
import { ExprBase, Input } from "../ExprBase"
import { precident } from "../precidents"
import { Not } from "./Not"
import { Or } from "./Or"

export class And extends ExprBase{
    static equivs = ()=> [
        new Associate(And),
        new Communative(And),
        new Absorber(And, true),
        new Anhiliator(And, false),
        new Distribute(Not, 0, And, Or),
        new Distribute(And, 0, Or),
        new Distribute(And, 1, Or),
        formula(
            new And("x", "x"),
            "x"
        ),
        formula(
            new And("x", new Not("x")),
            false
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "And"

    constructor(...children: Expr[]){
        super(children)

        if (children.some(c=>c.type == "number")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }
}