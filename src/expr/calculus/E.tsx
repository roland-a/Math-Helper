import { formula } from "../../equivalences/Formula";
import { Add } from "../basic/Add";
import { Div } from "../basic/Div";
import { Pow } from "../basic/Pow";
import { DisplayMod, Expr } from "../Expr";
import { ExprBase } from "../ExprBase";
import { Derive } from "./Derive";
import { Infinity } from "./Infinity";
import { Limit } from "./Limit";



export const E = new class extends ExprBase{
    readonly generallyUnambigious = true

    constructor(){
        super([])
    }

    equivs = ()=> {
        let Derive = require("../calculus/Derive").Derive
        let Add = require("../basic/Add").Add
        let Pow = require("../basic/Pow").Pow
        let Div = require("../basic/Div").Div
        let Limit = require("../calculus/Limit").Limit 
        
        return [
            formula(
                E,
                new Limit("n", Infinity, new Pow(new Add(1, new Div(1, "n")), "n"))
            ), 
            formula(
                new Derive(new Pow(E, "x"), "x"),
                new Pow(E, "x")
            )
        ]
    }

    display(d: DisplayMod): JSX.Element {
        return d.wrap(
            <span>e</span>
        )
    }
}