
import { TypeBox } from "../expr/TypeBox";
import { Expr } from "../expr/Expr";
import { char } from "../misc/Char";
import { int } from "../misc/Int";
import { Pow } from "../expr/basic/Pow";
import { Roots } from "../expr/basic/Roots";
import { Tan } from "../expr/trigonometry/Tan";
import { Cos } from "../expr/trigonometry/Cos";
import { Sin } from "../expr/trigonometry/Sin";
import { Assign } from "../expr/calculus/Assign";
import { Limit } from "../expr/calculus/Limit";
import { Derive } from "../expr/calculus/Derive";
import { Integrate } from "../expr/calculus/Integrate";
import { Div } from "../expr/basic/Div";
import { ASin } from "../expr/trigonometry/ASin";
import { ACos } from "../expr/trigonometry/ACos";
import { ATan } from "../expr/trigonometry/ATan";
import { Pi } from "../expr/trigonometry/Pi";
import { And } from "../expr/boolean/And";
import { Any } from "../expr/calculus/Any";
import { All } from "../expr/calculus/All";
import { Not } from "../expr/boolean/Not";
import { UIExpr } from "./UiExpr";
import { Var } from "../expr/calculus/Var";

export class KeyBoards{
    private readonly fn: (_:Expr|char)=>void

    private curr: int = 0

    sections: Section[] 

    constructor(fn:  (_:Expr|char)=>void) {
        this.fn = fn

        this.sections = [
            this.initSection(
                "main",
                [
                    ()=>"+",
                    ()=>"-",
                    ()=>"*",
                    ()=>Div.toExpr(new TypeBox(), new TypeBox()),
                    ()=>"=",
                ],
                [
                    ()=>Pow.toExpr(new TypeBox(), 2),  
                    ()=>Pow.toExpr(new TypeBox(), new TypeBox()), 
                    ()=>Roots.toExpr(2, new TypeBox()),
                    ()=>Roots.toExpr(new TypeBox(), new TypeBox())
                ],
            ),
            this.initSection(
                "trig",
                [
                    ()=>Sin.toExpr(new TypeBox()),
                    ()=>Cos.toExpr(new TypeBox()),
                    ()=>Tan.toExpr(new TypeBox()),
                    ()=>Pi.toExpr(),
                ],
                [
                    ()=>ASin.toExpr(new TypeBox()),
                    ()=>ACos.toExpr(new TypeBox()),
                    ()=>ATan.toExpr(new TypeBox()),
                    ()=>new Var("θ").toExpr(),
                ],
            ),
            this.initSection(
                "calc",
                [
                    ()=>Assign.toExpr(new TypeBox(), new TypeBox(), new TypeBox()),
                    ()=>Limit.toExpr(new TypeBox(), new TypeBox(), new TypeBox()),
                    ()=>Derive.toExpr(new TypeBox(), new TypeBox()),
                    ()=>(()=>{
                        let varr = new TypeBox()
                        return Integrate.toExpr(varr, 0, new TypeBox(), varr)
                    })(),
                    ()=>Integrate.toExpr(new TypeBox(), new TypeBox(), new TypeBox(), new TypeBox())
                ]
            ),
            this.initSection(
                "boolean",
                [
                    ()=>"∧",
                    ()=>"∨",
                    ()=>Not.toExpr(new TypeBox()),
                    ()=>Any.toExpr(new TypeBox(), new TypeBox()),
                    ()=>All.toExpr(new TypeBox(), new TypeBox())
                ]
            )
        ]
    }

    private initSection(name: string, ...section: (()=>Expr|char)[][]): Section{
        return new Section(
            name,
            section.map(
                s=>s.map(
                    b=>new Button(
                        ()=>b(), this.fn
                    )
                )
            )
        )
    }

    display(): JSX.Element{
        return <span className="Keyboard">
            {this.displaySections()}
            {this.displayButtons()}
        </span>
    }

    private displaySections(): JSX.Element{
        let forEach = (c:Section, i:int)=>{
            let onClick = ()=>{
                this.curr = i
            }

            return <button onClick={onClick} className="Section">
                {c.name}
            </button>
        }

        return <span className="Sections">
            {this.sections.map((c,i)=>forEach(c,i))}
        </span>
    }

    private displayButtons(){
        return <span className="Buttons">
            {this.sections[this.curr]!.buttons.map(r=><span className="Row">{r.map(b=>b.display())}</span>)}
        </span>
    }
}

class Section{
    readonly name: string
    readonly buttons: Button[][]

    constructor(name: string, buttons: Button[][]) {
        this.name = name
        this.buttons = buttons
    }
}

class Button{
    readonly fn: (_:Expr|char)=>void
    readonly output: ()=>Expr|char

    constructor(output: ()=>Expr|char, fn: (_:Expr|char)=>void) {
        this.output = output
        this.fn = fn
    }

    display(){
        return <button onClick={()=>this.fn(this.output())}>
            {(()=>{
                let r = this.output()

                if (r == "*") r = "×"

                if (typeof r == "string") return <>{r}</>

                return r.display(manip)
            })()}
        </button>
    }
}

function manip(p: UIExpr){
    if (p.op instanceof TypeBox){
        p.overridenContent = "☐"
    }
    else {
        p.children.forEach(c=>manip(c))
    }
}