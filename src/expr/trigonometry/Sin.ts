import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { pool } from "../../misc/Pooler";
import { Neg } from "../basic/Neg";
import { Derive } from "../calculus/Derive";
import { Expr } from "../Expr";
import { ExprBase, Input } from "../ExprBase";
import { Cos } from "./Cos";

import { TrigBase } from "./TrigBase";

export class Sin extends TrigBase{
    readonly cssName = "Sin"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }

    static equivs = ()=> [
        formula(
            new Derive(new Sin("x"), "x"),
            new Cos("x")  
        ),
        formula(
            new Sin("x"),
            new Derive(new Neg(new Cos("x")), "x")  
        ),
        new Simplifier(
            Sin,
            v=>Math.sin(v)
        )
    ]
}