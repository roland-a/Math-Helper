import { List, Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { pool } from "../../misc/Pooler";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";
import { Derive } from "./Derive";
import { Integrate } from "./Integrate";
import { Limit } from "./Limit";


const assignVar = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected instanceof Assign)) return null

        let targetVar = selected.get(1) as string
        let replacement = selected.get(2)

        return replace(
            selected.get(0),
            targetVar,
            replacement
        )
    }
}

function replace(e: Expr, target: string, r: Expr): Expr{
    //todo replace this with a better way
    if (e instanceof Assign || e instanceof Limit || e instanceof Derive || e instanceof Integrate){
        return e
    }

    if (e == target) return r

    return e.map(c=>replace(c, target, r))
}

const reverseAssignVar = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (subSelected.size != 1) return null

        let t = new TypeBox()

        return new Assign(
            selected.set(subSelected.toArray()[0], t),
            t,
            selected.get(subSelected.toArray()[0])
        )
    }
}

export class Assign extends ExprBase{
    static equivs = ()=> [
        assignVar,
        reverseAssignVar,
    ]

    readonly generallyUnambigious = true
    readonly cssName = "Assign"

    constructor(func: Expr, targetVar: TypeBox|string, arg: Expr){
        super([func, targetVar, arg])

        if (!(typeof targetVar == "string" || targetVar instanceof TypeBox)) throw new Error()

        if (func.type != null && arg.type != null && func.type != arg.type) throw new Error()

        this.type = func.type ?? arg.type

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        if (e instanceof Derive) return true

        if (i==1) return false

        if (i==2) return true

        return null
    }
}