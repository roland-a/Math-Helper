import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { ExprBase } from "../ExprBase";

import { TrigBase } from "./TrigBase";

export class ACos extends TrigBase{
    readonly cssName = "ACos"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }
}