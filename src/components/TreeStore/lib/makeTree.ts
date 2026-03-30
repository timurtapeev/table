import type { TreeStoreData, TreeStoreDataID } from '../types/treeStoreData.ts'
import { type TreeStoreNode, TreeStoreNodeTypes } from '../types/treeStore.ts'

interface Node extends TreeStoreData {
  children: Node[]
  type: TreeStoreNodeTypes
}

export function makeTree(data: TreeStoreData[]): TreeStoreNode[] {
  const nodeMap: Record<TreeStoreDataID, Node> = {}
  const result: TreeStoreNode[] = []

  // 1. Инициализируем Map: создаем объекты TreeStoreNode для каждого элемента
  data.forEach((item) => {
    nodeMap[item.id] = {
      id: item.id,
      label: item.label,
      parent: item.parent,
      children: [],
      type: TreeStoreNodeTypes.ELEMENT,
    }
  })

  // 2. Строим иерархию
  data.forEach((item) => {
    const currentNode = nodeMap[item.id]
    const parentId = item.parent

    if (!currentNode) {
      return
    }

    if (parentId === null || !nodeMap[parentId]) {
      // Если родителя нет, это корневой узел
      result.push(currentNode)
    } else {
      // Добавляем текущий узел в детей родителя
      const parentNode = nodeMap[parentId]
      parentNode.children.push(currentNode)

      // Как только у родителя появился хоть один ребенок, меняем ему тип на "Группа"
      parentNode.type = TreeStoreNodeTypes.GROUP
    }
  })

  return result
}
