import { List } from "immutable";
import { UIExpr } from "../../ui/UiExpr";
import { Op } from "../Op";

export abstract class TrigBase extends Op{
    readonly generallyUnambigious = true

    childAmbigious(e: Op, i: number): boolean | null {
        return true
    }
}