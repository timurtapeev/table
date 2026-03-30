import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import { TreeDataModule, RowNumbersModule } from 'ag-grid-enterprise'

ModuleRegistry.registerModules([AllCommunityModule, TreeDataModule, RowNumbersModule])

createApp(App).mount('#app')
