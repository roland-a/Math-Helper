import { pool } from "../../misc/Pooler";
import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";
import { Type } from "../Type";

export class Bool extends Op{
    readonly cssName = "Bool"

    readonly inner: boolean

    readonly generallyUnambigious = true

    constructor(inner: boolean){ super()
        this.inner = inner

        return pool(this)
    }

    type(): Type {
        return Type.Bool
    }

    applyUnary(fn: (num: boolean)=>boolean): Bool{
        return new Bool(fn(this.inner))
    }

    applyBinary(other: Bool, fn: (num1: boolean, num2: boolean)=>boolean): Bool{
        return new Bool(
            fn(this.inner, other.inner)
        )
    }

    modifyUi(self: UIExpr): void {
        self.overridenContent = JSON.stringify(this.inner)
    }
}