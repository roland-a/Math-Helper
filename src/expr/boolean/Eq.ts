import { Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { Class } from "../../misc/Class";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Add } from "../basic/Add";
import { Div } from "../basic/Div";
import { Mult } from "../basic/Mult";
import { TypeBox } from "../TypeBox";
import { Expr } from "../Expr";
import { Op } from "../Op";
import { Bool } from "./Bool";
import { precident } from "../helper";


class BothSides extends EquivGen{
    op: Op

    isContinuous: boolean

    constructor(op: Op, isContinuous: boolean = false) { super()
        this.op = op
        this.isContinuous = isContinuous
    }

    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected.is(Eq))) return null

        let t = new TypeBox()
        
        return Eq.toExpr(
            this.newSide(selected.get(0), t.toExpr()),
            this.newSide(selected.get(1), t.toExpr()),
        )
    }


    private newSide(side: Expr, t: Expr){
        if (side.is(this.op) && this.isContinuous){
            return this.op.toExpr(...[...side.children, t])
        }
        return this.op.toExpr(side, t)
    }
}

const eqImm = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (typeof selected == "boolean" && selected == true){
            let t = new TypeBox()

            return Eq.toExpr(t, t)
        }

        if (!(selected.is(Eq))) return null

        if (selected.children.some(c=> !(typeof c == "number" || typeof c == "boolean"))) return null

        return new Bool(selected.children.get(0) == selected.children.get(1)).toExpr()
    }
}

export const Eq = new class extends Op{
    equivs = ()=> [
        eqImm,
        new BothSides(Add, true),
        new BothSides(Mult, true),
        new BothSides(Div)
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Eq"
    
    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }
}

