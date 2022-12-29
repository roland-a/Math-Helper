import { Set } from "immutable";
import { Op } from "../expr/Op";
import { Expr } from "../expr/Expr";
import { EquivGen } from "./EquivGen";
import { PrettyExpr, unprettify } from "../expr/helper";

export class Anhiliator extends EquivGen{
    readonly op: Op
    readonly annhiliator: Expr

    constructor(op: Op, annhiliator: PrettyExpr){ super()
        this.op = op
        this.annhiliator = unprettify(annhiliator)
    }

    generate(selected: Expr, subSelected: Set<number>): Expr | null {
        if (!(selected.is(this.op))) return null

        if (!selected.children.some(c=>c == this.annhiliator)) return null

        return this.annhiliator
    }
}