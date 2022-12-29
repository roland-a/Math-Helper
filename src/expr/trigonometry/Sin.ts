import { formula } from "../../equivalences/Formula";
import { Simplifier } from "../../equivalences/Simplifier";
import { Neg } from "../basic/Neg";
import { Derive } from "../calculus/Derive";
import { Cos } from "./Cos";

import { TrigBase } from "./TrigBase";

export const Sin = new class extends TrigBase{
    readonly cssName = "Sin"
    
    equivs = ()=> [
        formula(
            Derive.toExpr(Sin.toExpr("x"), "x"),
            Cos.toExpr("x")  
        ),
        formula(
            Sin.toExpr("x"),
            Derive.toExpr(Neg.toExpr(Cos.toExpr("x")), "x")  
        ),
        new Simplifier(
            Sin,
            v=>Math.sin(v)
        )
    ]
}