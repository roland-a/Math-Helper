import { Pow } from "../expr/basic/Pow";
import { TypeBox } from "../expr/TypeBox";
import { Expr } from "../expr/Expr";
import { char } from "../misc/Char";
import { int } from "../misc/Int";
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
import { Any } from "../expr/boolean/Any";
import { All } from "../expr/boolean/All";
import { Not } from "../expr/boolean/Not";
import { PreJSX } from "./PreJsx";

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
                    ()=>new Div(new TypeBox(), new TypeBox()),
                    ()=>"=",
                ],
                [
                    ()=>new Pow(new TypeBox(), 2),  
                    ()=>new Pow(new TypeBox(), new TypeBox()), 
                    ()=>new Roots(2, new TypeBox()),
                    ()=>new Roots(new TypeBox(), new TypeBox())
                ],
            ),
            this.initSection(
                "trig",
                [
                    ()=>new Sin(new TypeBox()),
                    ()=>new Cos(new TypeBox()),
                    ()=>new Tan(new TypeBox()),
                    ()=>Pi,
                ],
                [
                    ()=>new ASin(new TypeBox()),
                    ()=>new ACos(new TypeBox()),
                    ()=>new ATan(new TypeBox()),
                    ()=>"θ",
                ],
            ),
            this.initSection(
                "calc",
                [
                    ()=>new Assign(new TypeBox(), new TypeBox(), new TypeBox()),
                    ()=>new Limit(new TypeBox(), new TypeBox(), new TypeBox()),
                    ()=>new Derive(new TypeBox(), new TypeBox()),
                    ()=>(()=>{
                        let varr = new TypeBox()
                        return new Integrate(varr, 0, new TypeBox(), varr)
                    })(),
                    ()=>new Integrate(new TypeBox(), new TypeBox(), new TypeBox(), new TypeBox())
                ]
            ),
            this.initSection(
                "boolean",
                [
                    ()=>"∧",
                    ()=>"∨",
                    ()=>new Not(new TypeBox()),
                    ()=>new Any(new TypeBox(), new TypeBox()),
                    ()=>new All(new TypeBox(), new TypeBox())
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

                return r.toPreJSX().display(manip)
            })()}
        </button>
    }
}

function manip(p: PreJSX){
    if (p.e instanceof TypeBox){
        p.override("☐")
    }
    else {
        p.forEach(c=>manip(c))
    }
}