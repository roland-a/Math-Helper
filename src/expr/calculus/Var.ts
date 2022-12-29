import { List } from "immutable";
import { pool } from "../../misc/Pooler";
import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";
import { Type } from "../Type";

export class Var extends Op{
    readonly cssName = "Var"
    readonly generallyUnambigious = true

    readonly inner: string

    constructor(inner: string){ super()
        this.inner = inner

        return pool(this)
    }

    type(): Type {
        return Type.Var
    }

    modifyUi(self: UIExpr): void {
        self.overridenContent = JSON.stringify(this.inner)
    }
}