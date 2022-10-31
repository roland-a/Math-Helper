import { List, Set } from "immutable";
import { Expr} from "../expr/Expr";
import { Class } from "../misc/Class";
import { int } from "../misc/Int";
import { EquivGen } from "./EquivGen";

export class Distribute extends EquivGen{
    op: Class<Expr>
    collective1: Class<Expr>
    collective2: Class<Expr>
    index: int

    constructor(
        op: Class<Expr>, 
        index: int,
        collective1: Class<Expr>, 
        collective2: Class<Expr>=collective1, 
    ) { super()
        this.op = op
        this.collective1 = collective1
        this.collective2 = collective2
        this.index = index
    }

    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (subSelected.size != 0) return null

        return this.generate1(selected) ?? this.generate2(selected) ?? null
    }

    generate1(selected: Expr): Expr|null {
        if (!(selected instanceof this.op)) return null

        let collective = selected.get(this.index)

        if (!(collective instanceof this.collective1)) return null

        return new this.collective2(
            ...collective.children.map(
                c=> new this.op(
                    ...selected.children.set(this.index, c)
                )
            )
        )
    }

    generate2(selected: Expr): Expr|null {
        if (!(selected instanceof this.collective2)) return null

        let collective = selected.children

        if (collective.size <= this.index) return null
        
        let dist = collective.get(0)!.children

        let flag = collective.some(c=> !this.match(c.children, dist) || !(c instanceof this.op))

        if (flag) return null

        return new this.op(
            ...dist.set(
                this.index, 
                new this.collective1(
                    ...collective.map(c=>c.get(this.index))
                )
            )
        )
    }

    private match(children1: List<Expr>, children2: List<Expr>): boolean{
        if (children1.size != children2.size) return false

        if (children1.size == 0) return false 

        for (let i = 0; i < children1.size; i++){
            if (i == this.index) continue
            

            if (children1.get(i) != children2.get(i)!) return false
        }
        return true
    }
}