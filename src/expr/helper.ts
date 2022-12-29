
import { Add } from "./basic/Add"
import { Mult } from "./basic/Mult"
import { Num } from "./basic/Num"
import { Pow } from "./basic/Pow"
import { Sub } from "./basic/Sub"
import { And } from "./boolean/And"
import { Eq } from "./boolean/Eq"
import { Or } from "./boolean/Or"
import { Assign } from "./calculus/Assign"
import { Derive } from "./calculus/Derive"
import { Integrate } from "./calculus/Integrate"
import { Limit } from "./calculus/Limit"
import { Var } from "./calculus/Var"
import { Expr } from "./Expr"
import { Op } from "./Op"

export type PrettyExpr = Expr|number|string|boolean|Op

export function unprettify(e: PrettyExpr): Expr{
    let Num = require("./basic/Num").Num
    let Var = require("./calculus/Var").Var
    let Bool = require("./boolean/Bool").Bool

    if (typeof e == "number"){
        return new Num(e).toExpr()
    }
    if (typeof e == "string"){
        return new Var(e).toExpr()
    }
    if (typeof e == "boolean"){
        return new Bool(e).toExpr()
    }
    if (e instanceof Op){
        return e.toExpr()
    }
    return e
}

export function isConst(e: Expr, varr:Expr): boolean{
    if (e.op instanceof Num) return true
    if (e.op instanceof Var) return e != varr

    if (e.is(Assign) || e.is(Limit) || e.is(Derive) || e.is(Integrate)) return false

    return !e.children.some(c=>!isConst(c, varr))
}

export function precident(parent: Op, child: Op): boolean|null{
    const list: Op[] = [
        Pow,
        Mult,
        Add,
        Sub,
        Eq,
        And,
        Or
    ]

    let i = list.findIndex(c=>parent == c)
    let j = list.findIndex(c=>child == c)

    if (i==-1 || j==-1) return null

    return i<=j
}





