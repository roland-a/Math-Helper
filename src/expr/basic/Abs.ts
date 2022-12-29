import { Distribute } from "../../equivalences/Distribute";

import { Simplifier } from "../../equivalences/Simplifier";
import { Op } from "../Op";
import { Mult } from "./Mult";

export const Abs = new class extends Op{
    equivs = ()=> [
        new Distribute(Abs, 0, Mult),
        new Simplifier(Abs, a=>Math.abs(a)),
    ]

    readonly cssName = "Abs"
    readonly generallyUnambigious = true
}