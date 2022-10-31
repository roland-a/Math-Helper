import { Class } from "../misc/Class";
import { DisplayMod, Expr } from "./Expr";
import { ExprBase, Input } from "./ExprBase";

export abstract class Unary extends ExprBase{
    constructor(inner: Expr){
        super([inner])
    }

    childAmbigious(e: Expr, i: number): boolean | null {
        return this.innerAmbigious(e)
    }

    innerAmbigious(inner: Expr):boolean{
        return false
    } 

    display(d: DisplayMod): JSX.Element {
        let inner = this.get(0)

        return d.wrap(
            <span className={this.cssName}>
                {(()=>{
                    let jsx = inner.display(d.next(0, inner))

                    if (!this.innerAmbigious(inner) && (this.generallyUnambigious || inner.generallyUnambigious)){
                        return <span>{jsx}</span>
                    }
                    return <span><span className="Wrapped">{jsx}</span></span>
                })()}
            </span>
        )
    }
}