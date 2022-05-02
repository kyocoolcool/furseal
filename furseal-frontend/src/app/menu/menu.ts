import { CoreMenu } from '@core/types'

export const menu: CoreMenu[] = [
  {
    id: 'home',
    title: 'Home',
    translate: 'MENU.HOME',
    type: 'item',
    icon: 'home',
    url: 'home'
  },
  {
    id: 'product',
    title: 'Product',
    translate: 'MENU.PRODUCT',
    type: 'item',
    icon: 'list',
    url: 'products'
  },
  {
    id: 'bill',
    title: 'Bill',
    translate: 'MENU.BILL',
    type: 'item',
    icon: 'file',
    url: 'bills'
  },
  {
    id: 'salary',
    title: 'Salary',
    translate: 'MENU.SALARY',
    type: 'item',
    icon: 'user',
    url: 'salaries'
  },
  // {
  //   id: 'sample',
  //   title: 'Sample',
  //   translate: 'MENU.SAMPLE',
  //   type: 'item',
  //   icon: 'file',
  //   url: 'sample'
  // },

]
