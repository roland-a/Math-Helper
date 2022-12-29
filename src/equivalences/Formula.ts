import { Map, Set } from "immutable";
import { Var } from "../expr/calculus/Var";
import { PrettyExpr, unprettify } from "../expr/helper";
import { Expr as Expr } from "../expr/Expr";
import { TypeBox } from "../expr/TypeBox";
import { int } from "../misc/Int";
import { EquivGen } from "./EquivGen";

export function formula(left:PrettyExpr, right:PrettyExpr): EquivGen[]{
    return [
        new FormulaSide(
            unprettify(left),
            unprettify(right),
        ),
        new FormulaSide(
            unprettify(right),
            unprettify(left),
        ),
    ]
}

class FormulaSide extends EquivGen{
    private readonly to: Expr
    private readonly from: Expr

    constructor(from: Expr, to: Expr) { super()
        this.to = to
        this.from = from
    }

    type(){
        if (typeof this.from == "string") return "redundant"

        return "normal"
    }

    generate(selected: Expr, subSelected: Set<int>): Expr|null {
        if (subSelected.size != 0) return null

        let m = tryCreateMatchMap(selected, this.from)

        if (m == null) return null

        return map(this.to, fillPartialMap(m))
    }
}

function tryMergeMap<A,B>(m1: Map<A,B>, m2: Map<A,B>): Map<A,B>|null{
    let conflict = false
    
    m1.forEach((e, v)=>{
        if (m2.get(v) !== undefined && m2.get(v) !== e) conflict = true
    })

    if (conflict) return null

    return Map<A,B>({...m1.toObject(), ...m2.toObject()} as any as Iterable<[A,B]>)
}

function tryCreateMatchMap(expr: Expr, side: Expr): Map<Var, Expr>|null{
    if (side.op instanceof Var){
        let m = Map<Var, Expr>()
        
        return m.set(side.op, expr)
    }

    if (!expr.sameOp(side)) return null

    if (expr.children.size != side.children.size) return null

    let result: Map<Var, Expr>|null = Map()
    for (let i = 0; i < expr.children.size; i++){
        let m = tryCreateMatchMap(expr.children.get(i)!, side.children.get(i)!)

        if (m == null) return null

        result = tryMergeMap(result, m)

        if (result == null) return null
    }

    return result
}

function fillPartialMap(m: Map<Var,Expr>): FullVarMap {
    let extras: Map<Var, TypeBox> = Map()
    
    return (v: Var)=>{
        if (m.has(v)) return m.get(v)!
        
        if (extras.get(v) === undefined){
            extras = extras.set(v, new TypeBox()) 
        }

        return extras.get(v)!.toExpr()
    }
}

function map(expr: Expr, fn: FullVarMap): Expr{
    if (expr.op instanceof Var){
        return fn(expr.op)
    }

    return expr.map(
        c=>map(c, fn)
    )
}

type FullVarMap = (_:Var)=>Expr

