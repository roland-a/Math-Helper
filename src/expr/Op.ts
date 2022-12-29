import { List } from "immutable"
import { CloneMap } from "../misc/Clone"
import { int } from "../misc/Int"
import { UIExpr } from "../ui/UiExpr"
import { PrettyExpr, unprettify } from "./helper"
import { Expr as Expr } from "./Expr"

export abstract class Op{
    type: "number" | "boolean" | null = "number"

    //ui
    cssName: string = ""
    generallyUnambigious: boolean = false
    cssGrouping: [int,int][] = []
    childAmbigious(o: Op, i: int): boolean|null{
        return !o.generallyUnambigious
    }
    modifyUi(self: UIExpr): void{
    }

    toExpr(...children: PrettyExpr[]): Expr{
        return new Expr(
            this,
            List(children).map(c=>unprettify(c))
        )
    }

    validChildren(children: List<Op>): boolean{
        return children.findEntry(c=>c.type != "boolean") != undefined
    }

    clone(cloneMap: CloneMap): this{
        return this
    }
}

