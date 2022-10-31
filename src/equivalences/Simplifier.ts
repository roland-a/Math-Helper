import { int } from "../misc/Int"
import { Set } from "immutable"
import { EquivGen } from "./EquivGen"
import { Expr} from "../expr/Expr"
import { Class } from "../misc/Class"

export class Simplifier extends EquivGen{
    readonly op: Class<Expr>
    readonly fn: (left: number, right: number)=>number

    constructor(op: Class<Expr>, fn: (left: number, right: number)=>number) { super()
        this.op = op
        this.fn = fn
    }
    
    generate(selected: Expr, subSelected: Set<int>): Expr|null {
        if (!(selected instanceof this.op)) return null
        
        if (subSelected.size != 0) return null

        if (selected.children.some(c=>!(typeof c == "number"))) return null

        let r = (()=>{
            if (selected.children.size == 1){
                return this.fn((selected.get(0) as number), Number.NaN)
            }

            return selected.children.map(c=>(c as number)).reduce(this.fn)
        })()

        if (!Number.isFinite(r)) return null

        return r
    }
    
}