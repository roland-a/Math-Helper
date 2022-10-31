import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { ExprBase } from "../ExprBase";

import { TrigBase } from "./TrigBase";

export class Tan extends TrigBase{
    readonly cssName = "Tan"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }
}