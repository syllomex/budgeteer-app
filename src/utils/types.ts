import { Dispatch, SetStateAction } from 'react'

export type SetState<T> = Dispatch<SetStateAction<T>>
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]
export type Unpacked<T> = T extends (infer U)[] ? U : T
