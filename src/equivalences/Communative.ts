import { Set } from "immutable";
import { Expr } from "../expr/Expr";
import { Op } from "../expr/Op";
import { int } from "../misc/Int";
import { EquivGen } from "./EquivGen";

export class Communative extends EquivGen{
    readonly op: Op

    constructor(op: Op) { super()
        this.op = op
    }

    generate(selected: Expr, subSelected: Set<int>): Expr|null {
        if (!(selected.is(this.op))) return null

        if (subSelected.size != 2) return null

        let a = subSelected.toArray()[0]!
        let b = subSelected.toArray()[1]!

        if (a == b) return null

        return selected
            .set(
                b, 
                selected.children.get(a)!
            )
            .set(
                a, 
                selected.children.get(b)!
            )
    }
}