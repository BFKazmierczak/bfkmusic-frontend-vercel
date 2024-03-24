import { create } from 'zustand'

// type CustomHighlightType =
//   | [timeRange: string, fileId: number]
//   | [timeRange: undefined, fileId: undefined]

export type CustomHighlightType =
  | {
      timeRange: {
        begin: number
        end: number
      }
      fileId: number
    }
  | undefined

type HighlightStore = {
  highlight: CustomHighlightType
  setHighlight: (state: CustomHighlightType) => void
}

const useHighlightStore = create<HighlightStore>()((set) => ({
  highlight: undefined,
  setHighlight: (highlight) =>
    set((state) => {
      return {
        highlight: {
          timeRange: highlight?.timeRange,
          fileId: highlight?.fileId
        }
      }
    })
}))

export default useHighlightStore
