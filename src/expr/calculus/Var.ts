import { pool } from "../../misc/Pooler";
import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";

export class Var extends Op{
    readonly inner: string

    readonly generallyUnambigious = true

    constructor(inner: string){ super()
        this.inner = inner

        return pool(this)
    }

    modifyUi(self: UIExpr): void {
        self.overridenContent = JSON.stringify(this.inner)
    }
}