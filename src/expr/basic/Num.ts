import { pool } from "../../misc/Pooler";
import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";

export class Num extends Op{
    readonly cssName = "Num"

    readonly inner: number

    readonly generallyUnambigious = true

    constructor(inner: number){ super()
        this.inner = inner

        return pool(this)
    }

    applyUnary(fn: (num: number)=>number): Num{
        return new Num(fn(this.inner))
    }

    applyBinary(other: Num, fn: (num1: number, num2: number)=>number): Num{
        return new Num(
            fn(this.inner, other.inner)
        )
    }

    modifyUi(self: UIExpr): void {
        self.overridenContent = JSON.stringify(this.inner)
    }
}