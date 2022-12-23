import { List, Set } from "immutable";
import { EquivGen } from "../../equivalences/EquivGen";
import { Associate } from "../../equivalences/Associative";
import { Communative } from "../../equivalences/Communative";
import { Distribute } from "../../equivalences/Distribute";
import { Simplifier } from "../../equivalences/Simplifier";
import { Class } from "../../misc/Class";
import { int } from "../../misc/Int";
import { pool } from "../../misc/Pooler";
import { Derive } from "../calculus/Derive";
import { DisplayMod, Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";

import { precident } from "../precidents";
import { Add } from "./Add";
import { Integrate } from "../calculus/Integrate";
import { Assign } from "../calculus/Assign";
import { Limit } from "../calculus/Limit";
import { Absorber } from "../../equivalences/Absorber";
import { Anhiliator } from "../../equivalences/Anhiliator";
import { isConst } from "../helper";
import { PreJSX } from "../../ui/PreJsx";

const integrate = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected instanceof Derive)) return null

        let mults = selected.get(0)

        if (!(mults instanceof Mult)) return null

        let v = selected.get(1) as string

        return new Add(
            ...mults.children.map((_, i)=>mults.set(i, new Derive(mults.get(i), v)))
        )
    }
}

const moveOut = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected instanceof Derive || selected instanceof Integrate)) return null

        let mainIndex:int
        let varr: Expr
        if (selected instanceof Derive){
            mainIndex = 0
            varr = selected.get(1)
        }
        else {
            mainIndex = 2
            varr = selected.get(3)
        }

        if (typeof varr != "string") return null

        let mults = selected.get(mainIndex)
        
        if (!(mults instanceof Mult)) return null

        if (subSelected.size != 0) return null

        let consts = mults.children.filter(c=>isConst(c, varr as string))
        let nonconsts = mults.children.filter(c=>!isConst(c, varr as string))

        if (consts.size == 0) return null

        return new Mult(
            ...[
                ...consts,
                selected.set(mainIndex, new Mult(...nonconsts))
            ]
        )
    }
}

export class Mult extends ExprBase{
    static equivs = ()=> [
        new Associate(Mult),
        new Communative(Mult),
        new Absorber(Mult, 1),
        new Anhiliator(Mult, 0),
        new Distribute(Mult, 0, Add),
        new Distribute(Mult, 1, Add),
        new Simplifier(Mult, (l,r)=>l*r),
        integrate,
        moveOut,
    ]

    readonly cssName = "Mult"

    constructor(...children: Expr[]){
        super(children)

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }

    toPreJSX(): PreJSX {
        if (this.children.size==2 && typeof this.get(0) == "number" && typeof this.get(1) == "string"){
            return new PreJSX(
                this, 
                "",
                [
                    this.get(0).toPreJSX().setNthChild(0), 
                    this.get(1).toPreJSX().setNthChild(1)
                ]
            )
        }

        return super.toPreJSX()
    }
}

