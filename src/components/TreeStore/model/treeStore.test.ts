import { describe, it, expect, beforeEach } from 'vitest'
import { TreeStore } from './treeStore'
import type { TreeStoreData } from '../types/treeStoreData'

const testData: TreeStoreData[] = [
  { id: 1, parent: null, label: 'Айтем 1' },
  { id: '91064cee', parent: 1, label: 'Айтем 2' },
  { id: 3, parent: 1, label: 'Айтем 3' },
  { id: 4, parent: '91064cee', label: 'Айтем 4' },
  { id: 5, parent: '91064cee', label: 'Айтем 5' },
  { id: 6, parent: '91064cee', label: 'Айтем 6' },
  { id: 7, parent: 4, label: 'Айтем 7' },
  { id: 8, parent: 4, label: 'Айтем 8' },
]

describe('TreeStore', () => {
  let store: TreeStore

  beforeEach(() => {
    store = new TreeStore(testData)
  })

  describe('getAll', () => {
    it('should return a copy of the initial array', () => {
      const result = store.getAll()
      expect(result).toEqual(testData)
      expect(result).not.toBe(testData) // проверка, что копия
    })
  })

  describe('getItem', () => {
    it('should return the item by id', () => {
      expect(store.getItem(1)).toEqual(testData[0])
      expect(store.getItem('91064cee')).toEqual(testData[1])
    })

    it('should return undefined for non-existent id', () => {
      expect(store.getItem(999)).toBeUndefined()
    })
  })

  describe('getChildren', () => {
    it('should return direct children of the given id', () => {
      expect(store.getChildren(1)).toEqual([testData[1], testData[2]])
      expect(store.getChildren('91064cee')).toEqual([testData[3], testData[4], testData[5]])
      expect(store.getChildren(4)).toEqual([testData[6], testData[7]])
    })

    it('should return empty array if no children', () => {
      expect(store.getChildren(3)).toEqual([])
      expect(store.getChildren(7)).toEqual([])
    })
  })

  describe('getAllChildren', () => {
    it('should return all descendants of the given id', () => {
      expect(store.getAllChildren(1)).toEqual([
        testData[1],
        testData[2],
        testData[3],
        testData[4],
        testData[5],
        testData[6],
        testData[7],
      ])
      expect(store.getAllChildren('91064cee')).toEqual([
        testData[3],
        testData[4],
        testData[5],
        testData[6],
        testData[7],
      ])
      expect(store.getAllChildren(4)).toEqual([testData[6], testData[7]])
    })

    it('should return empty array if no children', () => {
      expect(store.getAllChildren(3)).toEqual([])
    })
  })

  describe('getAllParents', () => {
    it('should return the chain from item to root', () => {
      expect(store.getAllParents(7)).toEqual([testData[6], testData[3], testData[1], testData[0]])
      expect(store.getAllParents(4)).toEqual([testData[3], testData[1], testData[0]])
      expect(store.getAllParents(1)).toEqual([testData[0]])
    })

    it('should return empty array for non-existent id', () => {
      expect(store.getAllParents(999)).toEqual([])
    })
  })

  describe('addItem', () => {
    it('should add a new item', () => {
      const newItem: TreeStoreData = { id: 9, parent: 3, label: 'Айтем 9' }
      store.addItem(newItem)
      expect(store.getItem(9)).toEqual(newItem)
      expect(store.getAll()).toHaveLength(testData.length + 1)
      expect(store.getChildren(3)).toEqual([newItem])
    })

    it('should throw error if id already exists', () => {
      const duplicateItem: TreeStoreData = { id: 1, parent: null, label: 'Duplicate' }
      expect(() => store.addItem(duplicateItem)).toThrow('Item with id 1 already exists')
    })
  })

  describe('removeItem', () => {
    it('should remove item and all its children', () => {
      store.removeItem('91064cee')
      expect(store.getItem('91064cee')).toBeUndefined()
      expect(store.getItem(4)).toBeUndefined()
      expect(store.getItem(5)).toBeUndefined()
      expect(store.getItem(6)).toBeUndefined()
      expect(store.getItem(7)).toBeUndefined()
      expect(store.getItem(8)).toBeUndefined()
      expect(store.getAll()).toHaveLength(2) // остались 1 и 3
    })

    it('should remove only the item if no children', () => {
      store.removeItem(3)
      expect(store.getItem(3)).toBeUndefined()
      expect(store.getAll()).toHaveLength(testData.length - 1)
    })
  })

  describe('updateItem', () => {
    it('should update the existing item', () => {
      const updatedItem: TreeStoreData = { id: 1, parent: null, label: 'Updated Айтем 1' }
      store.updateItem(updatedItem)
      expect(store.getItem(1)).toEqual(updatedItem)
    })

    it('should throw error if id does not exist', () => {
      const nonExistentItem: TreeStoreData = { id: 999, parent: null, label: 'Non-existent' }
      expect(() => store.updateItem(nonExistentItem)).toThrow('Item with id 999 does not exist')
    })
  })
})
