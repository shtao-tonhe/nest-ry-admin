import { Pagination, DictTag } from '@/components/Global'

export default function registerGlobalComponents(app: any) {
  app.component('Pagination', Pagination)
  app.component('DictTag', DictTag)
}
