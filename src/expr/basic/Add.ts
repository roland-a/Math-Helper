import { Absorber } from "../../equivalences/Absorber";
import { Associate } from "../../equivalences/Associative";
import { Communative } from "../../equivalences/Communative";
import { Distribute } from "../../equivalences/Distribute";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Derive } from "../calculus/Derive";
import { Integrate } from "../calculus/Integrate";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";

import { precident } from "../precidents";

export class Add extends ExprBase{
    static equivs = ()=> [
        new Associate(Add),
        new Communative(Add),
        new Simplifier(Add,(l,r)=>l+r),
        new Distribute(Integrate, 2, Add),
        new Distribute(Derive, 0, Add),
        new Absorber(Add, 0)
    ]

    readonly cssName = "Add"

    constructor(...children: Expr[]){
        super(children)

        if (this.children.some(c=>c.type=="boolean")) throw new Error()

        return pool(this)
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return precident(this, e)
    }
}