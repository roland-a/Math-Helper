import { Set } from "immutable";
import { Expr } from "../expr/Expr";
import { int } from "../misc/Int";

export abstract class EquivGen{
    abstract generate(selected: Expr, subSelected: Set<int>): Expr|null

    type(): "normal" | "redundant" {
        return "normal"
    }
}
