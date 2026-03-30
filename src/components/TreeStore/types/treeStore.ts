type TreeStoreNodeID = string | number

export enum TreeStoreNodeTypes {
  GROUP = 'Группа',
  ELEMENT = 'Элемент',
}

export interface TreeStoreNode {
  id: TreeStoreNodeID
  label: string
  type: TreeStoreNodeTypes
  children: TreeStoreNode[]
}
