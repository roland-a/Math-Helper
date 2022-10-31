
import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { ExprBase } from "../ExprBase";

import { TrigBase } from "./TrigBase";

export class ASin extends TrigBase{
    readonly cssName = "ASin"

    constructor(inner: Expr){ 
        super(inner)

        return pool(this)
    }
}