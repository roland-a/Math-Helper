import { Map } from "immutable";

let map = Map<any,any>()

export function pool<T>(value: T): T{
    let m = toMap(value)

    if (!map.has(m)){
        map = map.set(m, value)
    }
    return map.get(m)! as T
}

function toMap(value: any): any{
    if (typeof value != "object") return value
    if (value == null) return value

    let m = Map(Object.keys(value).map(k => [k, value[k]]))

    m = m.map(c=>toMap(c))
    m = m.set("__class__", value.constructor)
   
    return m
}

