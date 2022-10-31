import { formula } from "../../equivalences/Formula"
import { pool } from "../../misc/Pooler"
import { Expr } from "../Expr"
import { ExprBase, Input } from "../ExprBase"
import { precident } from "../precidents"
import { TypeBox } from "../TypeBox"
import { Unary } from "../Unary"

export class Not extends Unary{
    static equivs = ()=> [
        formula(
            new Not(new Not("x")),
            "x"
        ),
        formula(
            new Not(true),
            false
        ),
        formula(
            new Not(false),
            true
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Not"

    constructor(inner: Expr){
        super(inner)

        if (inner.type == "number") throw new Error()

        return pool(this)
    }  
    

}