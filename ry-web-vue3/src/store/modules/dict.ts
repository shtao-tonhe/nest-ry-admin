import { allDataTypeList } from '@/api/system/dict/data'
import { defineStore } from 'pinia'
const useDictStore = defineStore('dict', {
  state: () => ({
    isSetDict: false,
    dictMap: []
  }),
  getters: {
    getDictMap(): Recordable {
      return this.dictMap
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    }
  },
  actions: {
    async initDictMap() {
      const res: any = await allDataTypeList()
      this.dictMap = res.data
    },
    setIsSetDict(isSetDict: boolean) {
      this.isSetDict = isSetDict
    }
  }
})

export default useDictStore
