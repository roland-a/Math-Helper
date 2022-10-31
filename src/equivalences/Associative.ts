import { int } from "../misc/Int";
import { Set } from "immutable";
import { EquivGen } from "./EquivGen";
import { Expr } from "../expr/Expr";
import { Class } from "../misc/Class";

export class Associate extends EquivGen{
    readonly op: Class<Expr>

    constructor(op: Class<Expr>) { super()
        this.op = op
    }

    generate(selected: Expr, subSelected: Set<int>): Expr|null {
        if (!(selected instanceof this.op)) return null

        if (subSelected.size == 0) return null

        if (subSelected.size == 1){
            return this.expand(selected, subSelected.toArray()[0]!)
        }

        return this.collapse(selected, subSelected)
    }

    expand(base: Expr, subSelected: int): Expr|null{
        let inner = base.get(subSelected)!

        if (!(inner instanceof this.op)) return null

        return new this.op(
            ...base.children.splice(subSelected, 1, ...inner.children)
        )
    }

    collapse(base: Expr, subSelected: Set<int>): Expr|null{
        if (subSelected.size == base.children.size) return null

        let outside = base.children.filter((_,i)=>!subSelected.has(i))
        let inside = base.children.filter((_,i)=>subSelected.has(i))

        let first = Math.min(subSelected.toArray()[0], base.children.size-1)

        return new this.op(
            ...outside.splice(first, 0, new this.op(...inside))
        )
    }
}