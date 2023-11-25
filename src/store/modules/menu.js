import { defineStore } from 'pinia'
import _ from 'lodash';
import { scrollToTag } from '../../utils/scroll';

const useUserMenu = defineStore(
    'menu',
    {
        state: ()=>({
            menu: [],
            isCollapse: false, 
            currentMenu: null,
            tabsList: JSON.parse(sessionStorage.getItem('tabs')) || [],
        }),
        actions: {
            selectMenu(val) {
                // 判断
                if (val.name == "home") {
                  this.currentMenu = null;
                } else {
                    this.currentMenu = val;
                  let result = this.tabsList.findIndex((item) => item.name === val.name);
                  
                    result == -1 ? this.tabsList.push(_.cloneDeep(val)) : "";
                    sessionStorage.setItem('tabs', JSON.stringify(this.tabsList));
                    scrollToTag(val.name)
                }
            },
            closeTab(val) {
                let res = this.tabsList.findIndex((item) => item.name === val.name);
                this.tabsList.splice(res, 1);
                sessionStorage.setItem('tabs', JSON.stringify(this.tabsList));
            },
        },
        
        // persist: true
        
    }

)
export default useUserMenu