import { formula } from "../../equivalences/Formula"
import { pool } from "../../misc/Pooler"
import { Assign } from "../calculus/Assign"
import { Expr } from "../Expr"
import { ExprBase, Input } from "../ExprBase"
import { precident } from "../precidents"
import { TypeBox } from "../TypeBox"
import { And } from "./And"

export class All extends ExprBase{
    static equivs = ()=> [
        formula(
            new All("x", "f"),
            new And(new All("x", "f"), new Assign("f", "x", "a"))
        )
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "All"
    readonly generallyUnambigious = true

    constructor(varr: TypeBox|string, func: Expr){
        super([varr, func])

        if (func.type == "number") throw new Error()

        return pool(this)
    }
}