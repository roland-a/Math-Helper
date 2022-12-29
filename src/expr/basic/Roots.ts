import { formula } from "../../equivalences/Formula"
import { int } from "../../misc/Int"
import { UIExpr } from "../../ui/UiExpr"
import { Op } from "../Op"
import { Div } from "./Div"
import { Num } from "./Num"
import { Pow } from "./Pow"

export const Roots = new class extends Op{
    equivs = ()=>[
        formula(
            Roots.toExpr("n", "x"),
            Pow.toExpr("x", Div.toExpr(1,"n"))
        )
    ]

    readonly generallyUnambigious = true

    readonly cssGroupings: [int,int][] = [[1,1]]

    readonly cssName = "Roots"

    modifyUi(self: UIExpr): void {
        console.log(self.children.get(0)!.op)

        if (self.children.get(0)!.op == new Num(2)){
            self.children.get(0)!.overridenContent = ""
        }
    }
}