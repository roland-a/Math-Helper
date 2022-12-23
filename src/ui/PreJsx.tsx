import { Any } from "../expr/boolean/Any"
import { Expr } from "../expr/Expr"
import { Class } from "../misc/Class"
import { int } from "../misc/Int"

export class PreJSX{
    readonly e: Expr|null
    private readonly name: string
    private content: PreJSX[]|string

    nthChild: int|null

    private wrappers: string[]
    private onLeftClick: ()=>void
    private onRightClick: ()=>void


    constructor(e: Expr|null, name: string, content: PreJSX[]|string){
        this.e = e
        this.name = name
        this.nthChild = null

        this.content = content
        this.wrappers = []
        this.onLeftClick = ()=>{}
        this.onRightClick = ()=>{}
    }

    addLeftClick(fn: ()=>void){
        let prev = this.onLeftClick

        this.onLeftClick = ()=>{
            fn()
            prev()
        }
    }

    addRightClick(fn: ()=>void){
        let prev = this.onRightClick

        this.onRightClick = ()=>{
            fn()
            prev()
        }
    }

    wrap(name: string, apply:boolean=true): this{
        if (!apply) return this

        this.wrappers = [name, ...this.wrappers]

        return this
    }

    wrapOuter(name: string, apply:boolean=true): this{
        if (!apply) return this

        this.wrappers.push(name)

        return this
    }
    
    setNthChild(n: int): this{
        this.nthChild = n;

        return this
    }

    override(s: string): this{
        this.content = s

        return this
    }

    display(fn: (p:PreJSX)=>void){
        fn(this)

        return this.rawDisplay()
    }

    forEach(fn: (d: PreJSX, i:int)=>void){
        if (typeof this.content == "string") return

        return this.content.forEach(fn);
    }

    get(index: int): PreJSX{
        if (typeof this.content == "string") throw ""
        
        return this.content[index]!
    }

    //used double boxing so ::before and ::after would work as intended
    private rawDisplay(): JSX.Element{   
        let result: JSX.Element
        if (typeof this.content == "string"){
            result = <>{this.content}</>
        }
        else {
            result = <>{this.content.map(c=>c.rawDisplay())}</>
        }

        [this.name, ...this.wrappers].forEach(w=>{
            result = <span className={w}>{result}</span>
        })

        result = <span><span onClick={()=>this.onLeftClick()}>{result}</span></span>

        return result
    }
}