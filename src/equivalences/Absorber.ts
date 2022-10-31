import { Set } from "immutable";
import { Expr } from "../expr/Expr";
import { Class } from "../misc/Class";
import { EquivGen } from "./EquivGen";

export class Absorber extends EquivGen{
    readonly op: Class<Expr>
    readonly absorber: Expr

    constructor(op: Class<Expr>, absorber: Expr){ super()
        this.op = op
        this.absorber = absorber
    }

    generate(selected: Expr, subSelected: Set<number>): Expr | null {
        if (!(selected instanceof this.op)) return null

        if (!selected.children.some(c=>c===this.absorber)) return null

        let c = selected.children.filter(c=>c!==this.absorber)

        if (c.size == 1) return c.get(0)!

        return new this.op(...c)
    }
}