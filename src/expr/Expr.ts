import { List } from "immutable";
import { CloneMap } from "../misc/Clone";
import { int } from "../misc/Int";
import { Path } from "../misc/Path";
import { pool } from "../misc/Pooler";
import { UIExpr } from "../ui/UiExpr";
import { Op } from "./Op";


export class Expr{
    op: Op
    children: List<Expr>
    children_

    constructor(op: Op, children: List<Expr>){
        this.op = op
        this.children = children
        this.children_ = children.toArray()

        return pool(this)
    }

    type: "number" | "boolean" | null = null

    get(index: int): Expr{
        return this.children.get(index)!
    }

    set(index: int, e:Expr):this{
        return new Expr(
            this.op,
            this.children.set(index, e)
        ) as this
    }

    map(fn: (e: Expr, i: int)=>Expr): this{
        return new Expr(
            this.op,
            this.children.map(fn)
        ) as this
    }

    getFromPath(path: Path): Expr{
        return path.recurse<Expr>(
            this,
            (e, i)=> e.get(i)
        ) as this
    }

    setFromPath(path: Path, replacement: Expr): this{
        return path.replace(
            this,
            (e, i)=>e.get(i),
            (e, i, n)=>e.set(i, n),
            replacement
        ) as this
    }

    sameOp(other: Expr): boolean{
        return this.op == other.op
    }

    is(op: Op): boolean{
        return this.op === op
    }

    clone(cloneMap: CloneMap): this {
        return new Expr(
            this.op,
            this.children.map(c=>c.clone(cloneMap))
        ) as this
    }

    toUiExpr(): UIExpr {
        let result = new UIExpr(
            this.op,
            this.children.map(c=>c.toUiExpr())
        )

        this.op.modifyUi(result)

        return result
    }

    display(modifier: (u: UIExpr) => void): JSX.Element {
        let ui = this.toUiExpr()

        modifier(ui)

        return ui.display()
    }
}