import {ITEMS_PER_PAGE} from "../lib/filters";
import {getListFiltersFromQuery} from "../lib/filters";

export default {
  methods: {
    getListFilters(query,is_dynamic){
      const per_page = this.per_page || ITEMS_PER_PAGE;
      if(is_dynamic)
        query.proxy = true
      
      return getListFiltersFromQuery({...query}, per_page)
    },
    countDecimals(num){
      if(!num) return 0
      if(Math.floor(num) === num) return 0;
      return num.toString().split(".")[1].length || 0; 
    }
  }
}
