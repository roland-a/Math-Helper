import { List, Set } from "immutable"
import { int } from "../misc/Int"
import { TypeBox } from "./TypeBox"
import { Expr } from "./Expr"
import { EquivGen } from "../equivalences/EquivGen"
import { Div } from "./basic/Div"
import { Eq } from "./boolean/Eq"
import { Add } from "./basic/Add"
import { Pow } from "./basic/Pow"
import { Mult } from "./basic/Mult"
import { Sub } from "./basic/Sub"
import { Abs } from "./basic/Abs"
import { Assign } from "./calculus/Assign"
import { Limit } from "./calculus/Limit"
import { Derive } from "./calculus/Derive"
import { Integrate } from "./calculus/Integrate"
import { Neg } from "./basic/Neg"
import { Sin } from "./trigonometry/Sin"
import { Cos } from "./trigonometry/Cos"
import { E } from "./calculus/E"
import { Roots } from "./basic/Roots"
import { And } from "./boolean/And"
import { Or } from "./boolean/Or"
import { Any } from "./calculus/Any"
import { Not } from "./boolean/Not"
import { All } from "./calculus/All"

const free = new class extends EquivGen{
    generate(selected: Expr, subSelected: Set<number>): Expr|null {
        return new TypeBox().toExpr()
    }
}


const list = superFlat([
    free,
    Abs.equivs(),
    Add.equivs(),
    Sub.equivs(),
    Neg.equivs(),
    Mult.equivs(),
    Div.equivs(),
    Roots.equivs(),
    Pow.equivs(),
    Eq.equivs(),

    Sin.equivs(),
    Cos.equivs(),

    E.equivs(),
    Assign.equivs(),
    Limit.equivs(),
    Derive.equivs(),
    Integrate.equivs(),

    And.equivs(),
    Or.equivs(),
    Not.equivs(),
    Any.equivs(),
    All.equivs()
] as ((EquivGen[])|EquivGen)[]
) as EquivGen[]

function superFlat(e: any): any[]{
    if (!(e instanceof Array)) return [e]

    let result = [] as any[]

    e.forEach((c:any)=>{
        superFlat(c).forEach(q=>result.push(q))
    })

    return result
} 

export function getEquivs(selected: Expr, subSelected: Set<int>): Expr[]{
    let result = [] as Expr[]

    list.forEach(c=>{
        try{
            let e = c.generate(selected, subSelected)

            if (e == null) return

            if (c.type() == "normal"){
                //normal equivalancies shows first
                result.unshift(e)
            }
            else {
                //redundant equivalencies shows last
                result.push(e)
            }
        }
        catch(e){
            console.log(e)
        }
    })

    return result
}


