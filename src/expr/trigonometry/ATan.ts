
import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { ExprBase } from "../ExprBase";

import { TrigBase } from "./TrigBase";

export class ATan extends TrigBase{
    readonly cssName = "ATan"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }
}