export const ITEMS_PER_PAGE = 50;

export function shouldUpdateTransactionsData(new_params, old_params){
  for(let param in new_params){
    if(new_params.hasOwnProperty(param) && param !== 'page' && new_params[param] !== old_params[param]){
      return true
    }
  }
  return false
}

export const mapFilters = (items) => items.map((item) => ({value: item[0], display_name:item[1]}));
export const getPagesCount = (count, items_per_page=ITEMS_PER_PAGE) => Math.ceil(count/items_per_page);
export const getYearFIlterData = (number_of_items) => {
  const currentYear = (new Date()).getFullYear();
  const items = [];
  for (let i=0; i<number_of_items; i++){
    let year = currentYear-i;
    items.push({value: year.toString(), display_name: year})
  }
  return items
};

export function getLimitOffset(page, items_per_page) {
  const limit = items_per_page;
  const offset = (page-1)*limit;
  return {limit, offset}
}

// Used by BaseList and beforeRouteEnter functions
export function getListFiltersFromQuery(query, per_page) {
  const page = parseInt(query.page) || 1;
  const limit_offset = getLimitOffset(page, per_page);
  const filters = {...query, ...limit_offset};
  delete filters.page;
  return filters
}
