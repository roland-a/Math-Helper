import { Set } from "immutable"
import { Num } from "../expr/basic/Num"
import { unprettify } from "../expr/helper"
import { Expr } from "../expr/Expr"
import { Op } from "../expr/Op"
import { int } from "../misc/Int"
import { EquivGen } from "./EquivGen"

export class Simplifier extends EquivGen{
    readonly op: Op
    readonly fn: (left: number, right: number)=>number

    constructor(op: Op, fn: (left: number, right: number)=>number) { super()
        this.op = op
        this.fn = fn
    }
    
    generate(selected: Expr, subSelected: Set<int>): Expr|null {
        if (!selected.is(this.op)) return null
        
        if (subSelected.size != 0) return null

        if (selected.children.some(c=>!(c.op instanceof Num))) return null

        let result
        if (selected.children.size == 1){
            result = this.fn((selected.get(0).op as Num).inner, Number.NaN)
        }
        else {
            result = selected.children.map(c=>(c.op as Num).inner).reduce(this.fn)
        }

        if (!Number.isFinite(result)) return null

        return new Num(result).toExpr()
    }
    
}