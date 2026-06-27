function getPeers(row, col) {
  const peers = []
  for (let c = 0; c < 9; c++) if (c !== col) peers.push([row, c])
  for (let r = 0; r < 9; r++) if (r !== row) peers.push([r, col])
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (r !== row || c !== col) peers.push([r, c])
  return peers
}

export function computeConflicts(board) {
  const conflicts = new Set()

  const scanGroup = (cells) => {
    const seen = {}
    for (const [r, c] of cells) {
      const v = board[r][c]
      if (v === 0) continue
      if (seen[v] !== undefined) {
        conflicts.add(`${r},${c}`)
        conflicts.add(seen[v])
      } else {
        seen[v] = `${r},${c}`
      }
    }
  }

  for (let r = 0; r < 9; r++)
    scanGroup(Array.from({ length: 9 }, (_, c) => [r, c]))
  for (let c = 0; c < 9; c++)
    scanGroup(Array.from({ length: 9 }, (_, r) => [r, c]))
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const cells = []
      for (let r = br * 3; r < br * 3 + 3; r++)
        for (let c = bc * 3; c < bc * 3 + 3; c++)
          cells.push([r, c])
      scanGroup(cells)
    }

  return conflicts
}

export function computeNoteConflicts(notes) {
  const result = Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => new Set())
  )
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (!notes[r][c].size) continue
      const peers = getPeers(r, c)
      for (const num of notes[r][c]) {
        for (const [pr, pc] of peers) {
          if (notes[pr][pc].has(num)) {
            result[r][c].add(num)
            break
          }
        }
      }
    }
  }
  return result
}
