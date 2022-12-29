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
import { Expr } from "../Expr";
import { Op } from "../Op";

import { Add } from "./Add";
import { Integrate } from "../calculus/Integrate";
import { Assign } from "../calculus/Assign";
import { Limit } from "../calculus/Limit";
import { Absorber } from "../../equivalences/Absorber";
import { Anhiliator } from "../../equivalences/Anhiliator";
import { isConst, precident } from "../helper";
import { UIExpr } from "../../ui/UiExpr";

const integrate = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!selected.is(Derive)) return null

        let mults = selected.get(0)

        if (!mults.is(Mult)) return null

        let v = selected.get(1)

        return Add.toExpr(
            ...mults.children.map((_, i)=>mults.set(i, Derive.toExpr(mults.get(i), v)))
        )
    }
}

const moveOut = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        if (!(selected.is(Derive) || selected.is(Integrate))) return null

        let mainIndex:int
        let varr: Expr
        if (selected.is(Derive)){
            mainIndex = 0
            varr = selected.get(1)
        }
        else {
            mainIndex = 2
            varr = selected.get(3)
        }

        if (typeof varr != "string") return null

        let mults = selected.get(mainIndex)
        
        if (!(mults.is(Mult))) return null

        if (subSelected.size != 0) return null

        let consts = mults.children.filter(c=>isConst(c, varr))
        let nonconsts = mults.children.filter(c=>!isConst(c, varr))

        if (consts.size == 0) return null

        return Mult.toExpr(
            ...[
                ...consts,
                selected.set(mainIndex, Mult.toExpr(...nonconsts))
            ]
        )
    }
}

export const Mult = new class extends Op{
    equivs = ()=> [
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

    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }
}

