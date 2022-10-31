import { Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { Class } from "../../misc/Class";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Add } from "../basic/Add";
import { Div } from "../basic/Div";
import { Mult } from "../basic/Mult";
import { TypeBox } from "../TypeBox";
import { DisplayMod, Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";
import { precident } from "../precidents";


class BothSides extends EquivGen{
    op: Class<Expr>

    isContinuous: boolean

    constructor(op: Class<Expr>, isContinuous: boolean = false) { super()
        this.op = op
        this.isContinuous = isContinuous
    }

    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected instanceof Eq)) return null

        let t = new TypeBox()
        
        return new Eq(
            this.newSide(selected.get(0), t),
            this.newSide(selected.get(1), t),
        )
    }


    private newSide(side: Expr, t: Expr){
        if (side instanceof this.op && this.isContinuous){
            return new this.op(...[...side.children, t])
        }
        return new this.op(side, t)
    }
}

const eqImm = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (typeof selected == "boolean" && selected == true){
            let t = new TypeBox()

            return new Eq(t, t)
        }

        if (!(selected instanceof Eq)) return null

        if (selected.children.some(c=> !(typeof c == "number" || typeof c == "boolean"))) return null

        return selected.children.get(0) == selected.children.get(1)
    }
}

export class Eq extends ExprBase{
    static equivs = ()=> [
        eqImm,
        new BothSides(Add, true),
        new BothSides(Mult, true),
        new BothSides(Div)
    ]

    readonly type: "boolean" = "boolean"
    readonly cssName = "Eq"

    constructor(...expr: Expr[]) { 
        super(expr) 

        return pool(this)
    }
    
    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }
}

