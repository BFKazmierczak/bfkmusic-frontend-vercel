function parseGlobalID(globalID: string) {
  console.log({ globalID })

  const decoded = atob(globalID)

  console.log({ decoded })
}

export default parseGlobalID
