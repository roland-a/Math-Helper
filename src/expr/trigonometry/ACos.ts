import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { Op } from "../Op";

import { TrigBase } from "./TrigBase";

export const ACos = new class extends TrigBase{
    readonly cssName = "ACos"
}