import { List, Map } from "immutable";
let map = Map<any,any>()

export function pool<T>(value: T): T{
    if (typeof value != "object") return value
    if (value == null) return value

    let m = toMap(value)

    if (!map.has(m)){
        map = map.set(m, value)
    }
    return map.get(m)! as T
}

function toMap(value: any): any{
    let m = Map(value)

    m = m.map(c=>{
        if (c instanceof Array) return List(c)

        return c
    })

    return m
}

