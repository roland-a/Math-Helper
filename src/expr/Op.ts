import { List } from "immutable"
import { CloneMap } from "../misc/Clone"
import { int } from "../misc/Int"
import { UIExpr } from "../ui/UiExpr"
import { assertAllCanBe, PrettyExpr, unprettify } from "./helper"
import { Expr as Expr } from "./Expr"
import { Type } from "./Type"

export abstract class Op{
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

    type(children: List<Type>): Type{
        return Type.Num
    }

    validate(children: List<Type>): void{
        assertAllCanBe(Type.Num, children, this.cssName)
    }

    clone(cloneMap: CloneMap): this{
        return this
    }
}

