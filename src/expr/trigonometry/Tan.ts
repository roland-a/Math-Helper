import { pool } from "../../misc/Pooler";
import { Expr } from "../Expr";
import { Op } from "../Op";

import { TrigBase } from "./TrigBase";

export const Tan = new class extends TrigBase{
    readonly cssName = "Tan"
}