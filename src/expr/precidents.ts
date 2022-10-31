import { Class } from "../misc/Class"
import { Add } from "./basic/Add"
import { Mult } from "./basic/Mult"
import { Pow } from "./basic/Pow"
import { Sub } from "./basic/Sub"
import { And } from "./boolean/And"
import { Eq } from "./boolean/Eq"
import { Or } from "./boolean/Or"
import { Expr } from "./Expr"

export function precident(parent: Expr, child: Expr): boolean|null{
    const list: Class<Expr>[] = [
        Pow,
        Mult,
        Add,
        Sub,
        Eq,
        And,
        Or
    ]

    let i = list.findIndex(c=>parent instanceof c)
    let j = list.findIndex(c=>child instanceof c)

    if (i==-1 || j==-1) return null

    return i<=j
}