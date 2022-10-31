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
import { And } from "./And"
import { Not } from "./Not"

export class Or extends ExprBase{
    static equivs = () => [
        new Associate(Or),
        new Communative(Or),
        new Absorber(Or, false),
        new Anhiliator(Or, true),
        new Distribute(Not, 0, Or, And),
        new Distribute(Or, 0, And),
        new Distribute(Or, 1, And),
        formula(
            new Or("x", "x"),
            "x"
        ),
        formula(
            new Or("x", new Not("x")),
            true
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Or"

    constructor(...children: Expr[]){
        super(children)

        if (children.some(c=>c.type == "number")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }
}