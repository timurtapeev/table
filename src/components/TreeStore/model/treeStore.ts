import type { TreeStoreData, TreeStoreDataID } from '../types/treeStoreData.ts'

export class TreeStore {
  private data: TreeStoreData[]
  private map: Map<TreeStoreDataID, TreeStoreData>

  constructor(data: TreeStoreData[]) {
    this.data = [...data]
    this.map = new Map(data.map((item) => [item.id, item]))
  }

  getAll(): TreeStoreData[] {
    return this.data
  }

  getItem(id: TreeStoreDataID): TreeStoreData | undefined {
    return this.map.get(id)
  }

  getChildren(id: TreeStoreDataID): TreeStoreData[] {
    return this.data.filter((item) => item.parent === id)
  }

  getAllChildren(id: TreeStoreDataID): TreeStoreData[] {
    const result: TreeStoreData[] = []
    const queue: TreeStoreDataID[] = [id]

    while (queue.length > 0) {
      const currentId = queue.shift()!
      const children = this.getChildren(currentId)

      for (const child of children) {
        result.push(child)
        queue.push(child.id)
      }
    }

    return result
  }

  getAllParents(id: TreeStoreDataID): TreeStoreData[] {
    const parents: TreeStoreData[] = []
    let current = this.map.get(id)

    if (!current) {
      return parents
    }

    parents.push(current)

    while (current.parent !== null) {
      current = this.map.get(current.parent)

      if (!current) break

      parents.push(current)
    }

    return parents
  }

  addItem(item: TreeStoreData): void {
    if (this.map.has(item.id)) {
      throw new Error(`Item with id ${item.id} already exists`)
    }

    this.data.push(item)
    this.map.set(item.id, item)
  }

  removeItem(id: TreeStoreDataID): void {
    const idsToRemove = new Set<TreeStoreDataID>()
    const queue: TreeStoreDataID[] = [id]

    while (queue.length > 0) {
      const currentId = queue.shift()!

      idsToRemove.add(currentId)

      const children = this.getChildren(currentId)

      for (const child of children) {
        queue.push(child.id)
      }
    }

    this.data = this.data.filter((item) => !idsToRemove.has(item.id))

    for (const idToRemove of idsToRemove) {
      this.map.delete(idToRemove)
    }
  }

  updateItem(item: TreeStoreData): void {
    const existing = this.map.get(item.id)

    if (!existing) {
      throw new Error(`Item with id ${item.id} does not exist`)
    }

    Object.assign(existing, item)
  }
}
