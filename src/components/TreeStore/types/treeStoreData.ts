export type TreeStoreDataID = number | string

export interface TreeStoreData {
  id: TreeStoreDataID
  parent: TreeStoreDataID | null
  label: string
}
