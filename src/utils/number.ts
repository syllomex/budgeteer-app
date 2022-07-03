export const closest = (value: number, intervals: number[]) => {
  let lastDiff: number | null = null
  let closestIndex = -1

  intervals.forEach((interval, curIndex) => {
    const curDiff = Math.abs(interval - value)
    if (lastDiff === null || curDiff < lastDiff) {
      lastDiff = curDiff
      closestIndex = curIndex
    }
  })

  return intervals[closestIndex]
}
