
import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Neg } from "../basic/Neg";
import { Derive } from "../calculus/Derive";
import { Sin } from "./Sin";

import { TrigBase } from "./TrigBase";

export const Cos = new class extends TrigBase{
    readonly cssName = "Cos"

    equivs = ()=> [
        formula(
            Derive.toExpr(Cos.toExpr("x"), "x"),
            Neg.toExpr(Sin.toExpr(("x")))
        ),
        new Simplifier(
            Cos,
            v=>Math.cos(v)
        )
    ]
}