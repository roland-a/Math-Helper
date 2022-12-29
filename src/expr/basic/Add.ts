import { Absorber } from "../../equivalences/Absorber";
import { Associate } from "../../equivalences/Associative";
import { Communative } from "../../equivalences/Communative";
import { Distribute } from "../../equivalences/Distribute";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Derive } from "../calculus/Derive";
import { Integrate } from "../calculus/Integrate";
import { precident } from "../helper";
import { Expr } from "../Expr";
import { Op } from "../Op";

export const Add = new class extends Op{
    equivs = ()=> [
        new Associate(Add),
        new Communative(Add),
        new Simplifier(Add,(l,r)=>l+r),
        new Distribute(Integrate, 2, Add),
        new Distribute(Derive, 0, Add),
        new Absorber(Add, 0)
    ]

    readonly cssName = "Add"

    childAmbigious(e: Op, i: number): boolean | null {
        return precident(this, e)
    }
}