export type CloneMap = Map<any,any>

export function cloneHelper<T>(original: T, map: CloneMap, make: ()=>T, full: (_:T)=>void = (x)=>x): T{
    if (!map.has(original)){
        let r = make()

        map.set(original, r)

        full(r)
    }

    return map.get(original)!
}