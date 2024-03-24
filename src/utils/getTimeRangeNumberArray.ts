function getTimeRangeNumberArray(
  timeRangeStringArray: string[]
): [number, number] {
  const arr: [number, number] = [0, 0]

  timeRangeStringArray.forEach((value, index) => {
    if (index === 0 || index === 1) {
      arr[index] = Number(value)
    }
  })

  return arr
}

export default getTimeRangeNumberArray
