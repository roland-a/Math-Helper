
import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { Op } from "../Op";

import { TrigBase } from "./TrigBase";

export const ASin = new class extends TrigBase{
    readonly cssName = "ASin"
}