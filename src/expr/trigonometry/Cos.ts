
import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Neg } from "../basic/Neg";
import { Derive } from "../calculus/Derive";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";
import { Sin } from "./Sin";

import { TrigBase } from "./TrigBase";

export class Cos extends TrigBase{
    readonly cssName = "Cos"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }

    static equivs = ()=> [
        formula(
            new Derive(new Cos("x"), "x"),
            new Neg(new Sin(("x")))
        ),
        new Simplifier(
            Cos,
            v=>Math.cos(v)
        )
    ]
}