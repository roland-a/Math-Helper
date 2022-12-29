import { List, Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { pool } from "../../misc/Pooler";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { Op } from "../Op";
import { Derive } from "./Derive";
import { Integrate } from "./Integrate";
import { Limit } from "./Limit";
import { Var } from "./Var";


const assignVar = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected.is(Assign))) return null

        let targetVar = selected.get(1).op as Var
        let replacement = selected.get(2)

        return replace(
            selected.get(0),
            targetVar,
            replacement
        )
    }
}

function replace(e: Expr, target: Var, r: Expr): Expr{
    //todo replace this with a better way
    if (e.is(Assign) || e.is(Limit) || e.is(Derive) || e.is(Integrate)){
        return e
    }

    if (e.op == target) return r

    return e.map(c=>replace(c, target, r))
}

const reverseAssignVar = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (subSelected.size != 1) return null

        let t = new TypeBox()

        return Assign.toExpr(
            selected.set(subSelected.toArray()[0], t.toExpr()),
            t,
            selected.get(subSelected.toArray()[0])
        )
    }
}

export const Assign = new class extends Op{
    equivs = ()=> [
        assignVar,
        reverseAssignVar,
    ]

    readonly generallyUnambigious = true
    readonly cssName = "Assign"

    childAmbigious(e: Op, i: number): boolean | null {
        if (e == Derive) return true

        if (i==1) return false

        if (i==2) return true

        return null
    }
}