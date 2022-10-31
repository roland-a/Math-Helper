import { Map, Set } from "immutable";
import { Expr } from "../expr/Expr";
import { TypeBox } from "../expr/TypeBox";
import { int } from "../misc/Int";
import { EquivGen} from "./EquivGen";
import { convert, Input } from "../expr/ExprBase";



export function formula(left:Expr, right:Expr): EquivGen[]{
    return [
        new FormulaSide(
            left,
            right,
        ),
        new FormulaSide(
            right,
            left,
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

        let m = FormulaSide.match(selected, this.from)

        if (m == null) return null

        return FormulaSide.toTypeBoxExpr(this.to, FormulaSide.getVarToExpr(m))
    }
    
    private static match(expr: Expr, side: Expr): Map<string, Expr>|null{
        if (typeof side == "string"){
            let m = Map<string, Expr>()
            
            return m.set(side, expr)
        }

        if (!expr.sameOp(side)) return null

        if (expr.children.size != side.children.size) return null

        let result: Map<string, Expr>|null = Map()
        for (let i = 0; i < expr.children.size; i++){
            let m = FormulaSide.match(expr.children.get(i)!, side.children.get(i)!)

            if (m == null) return null

            result = FormulaSide.merge(result, m)

            if (result == null) return null
        }

        return result
    }

    private static merge<A,B>(m1: Map<A,B>, m2: Map<A,B>): Map<A,B>|null{
        let conflict = false
        
        m1.forEach((e, v)=>{
            if (m2.get(v) !== undefined && m2.get(v) !== e) conflict = true
        })

        if (conflict) return null

        return Map<A,B>({...m1.toObject(), ...m2.toObject()} as any as Iterable<[A,B]>)
    }

    private static getVarToExpr(m: Map<string,Expr>): VarToExpr {
        let extras: Map<string, TypeBox> = Map({})
        
        return (v)=>{
            if (m.has(v)) return m.get(v)!
            
            if (extras.get(v) === undefined){
                extras = extras.set(v, new TypeBox()) 
            }
    
            return extras.get(v)!
        }
    }
    
    private static toTypeBoxExpr(expr: Expr, fn: VarToExpr): Expr{
        if (typeof expr == "string"){
            return fn(expr)
        }
    
        return expr.map(
            c=>this.toTypeBoxExpr(c, fn)
        )
    }
}

type VarToExpr = (_:string)=>Expr

