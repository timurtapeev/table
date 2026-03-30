<script setup lang="ts">
import { TreeStore } from '@/components/TreeStore/model/treeStore.ts'
import { AgGridVue } from 'ag-grid-vue3'
import { makeTree } from '@/components/TreeStore/lib/makeTree.ts'
import type { TreeStoreData } from '@/components/TreeStore/types/treeStoreData.ts'
import type { GridOptions } from 'ag-grid-community'
import type { TreeStoreNode } from '@/components/TreeStore/types/treeStore.ts'

const props = defineProps<{
  list: TreeStoreData[]
}>()

const store = new TreeStore(props.list)
const value = store.getAll()

const gridOptions: GridOptions<TreeStoreNode> = {
  treeData: true,
  treeDataChildrenField: 'children',
  rowData: makeTree(value),
  columnDefs: [
    {
      field: 'label',
      headerName: 'Имя',
    },
  ],
  autoGroupColumnDef: {
    headerName: 'Категория',
    field: 'type',
    cellRendererParams: {
      suppressCount: true,
    },
  },
  groupDefaultExpanded: -1,
  defaultColDef: {
    flex: 1,
  },
  rowNumbers: true,
}
</script>

<template>
  <AgGridVue :gridOptions="gridOptions" style="height: 500px; width: 1000px" />
</template>

<style scoped></style>
