import { Set } from "immutable";
import { Expr } from "../expr/Expr";
import { Class } from "../misc/Class";
import { EquivGen } from "./EquivGen";

export class Anhiliator extends EquivGen{
    readonly op: Class<Expr>
    readonly annhiliator: Expr

    constructor(op: Class<Expr>, annhiliator: Expr){ super()
        this.op = op
        this.annhiliator = annhiliator
    }

    generate(selected: Expr, subSelected: Set<number>): Expr | null {
        if (!(selected instanceof this.op)) return null

        if (!selected.children.some(c=>c == this.annhiliator)) return null

        return this.annhiliator
    }
}