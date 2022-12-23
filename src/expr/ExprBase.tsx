import { List } from "immutable";
import { CloneMap } from "../misc/Clone";
import { int } from "../misc/Int";
import { Path } from "../misc/Path";
import { PreJSX } from "../ui/PreJsx";
import { E } from "./calculus/E";
import { Infinity } from "./calculus/Infinity";
import { DisplayMod, Expr} from "./Expr";
import { Pi } from "./trigonometry/Pi";

export type Input = {}

export type convert = {}

export abstract class ExprBase implements Expr{
    type: "number" | "boolean" | null = "number"
    readonly children: List<Expr>
    private readonly children_: Expr[]
    
    constructor(children: Expr[]){
        this.children = List(children)
        this.children_ = children
    }

    readonly get = (index: int): Expr=>{
        return this.children.get(index)!
    }

    readonly set = (index: int, replacement: Expr): this=>{
        return new (this.constructor as any)(
            ...this.children.set(index, replacement)
        )
    }

    readonly map = (fn: (e: Expr, i: int)=>Expr): this=>{
        if (this.children.size == 0) return this

        return new (this.constructor as any)(
            ...this.children.map(fn)
        )
    }

    readonly getFromPath = (path: Path): Expr=>{
        return path.recurse<Expr>(
            this,
            (e, i)=> e.get(i)
        )
    } 

    readonly setFromPath = (path: Path, replacement: Expr): Expr=>{
        return path.replace(
            this,
            (e, i)=>e.get(i),
            (e, i, n)=>e.set(i, n),
            replacement
        )
    }

    readonly sameOp = (other: Expr):boolean=>{
        if (this.children.size == 0){
            return this==other
        }
        return this.constructor==other.constructor
    }

    cssName: string = ""

    generallyUnambigious: boolean = false

    clone(cloneMap: CloneMap): this{
        return this.map(c=>c.clone(cloneMap))
    }

    parse(): Expr{
        return this.map(c=>c.parse())
    }

    childAmbigious(e: Expr, i: int): boolean|null{
        return false
    }

    toPreJSX(): PreJSX {
        return new PreJSX(
            this,
            this.cssName,
            this.children.toArray().map((c,i)=>
               c.toPreJSX()
                .setNthChild(i)
                .wrap(
                    "wrapped",
                    this.childAmbigious(c,i) ?? !c.generallyUnambigious
                )
            )
        );
    }
}