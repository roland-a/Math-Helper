import { Set } from "immutable";
import { PrettyExpr, unprettify } from "../expr/helper";
import { Expr } from "../expr/Expr";
import { Op } from "../expr/Op";
import { EquivGen } from "./EquivGen";

export class Absorber extends EquivGen{
    readonly op: Op
    readonly absorber: Expr

    constructor(op: Op, absorber: PrettyExpr){ super()
        this.op = op
        this.absorber = unprettify(absorber)
    }

    generate(selected: Expr, subSelected: Set<number>): Expr | null {
        if (!(selected.is(this.op))) return null

        if (!selected.children.some(c=>c===this.absorber)) return null

        let c = selected.children.filter(c=>c!==this.absorber)

        if (c.size == 1) return c.get(0)!

        return this.op.toExpr(...c)
    }
}