import { SearchQueryBuilder } from "@/constants/localInterfaces";

export class GeneralUtil {
  static searchQueryBuilder(options: SearchQueryBuilder){
    let query = `search=${options.search}`;

    if(options.category && options.category !== 'all'){
      query = `${query}&category=${options.category}`;
    }

    if(options.healthAuthority && options.healthAuthority != 'all'){
      query = `${query}&healthAuthority=${options.healthAuthority}`
    }

    if(options.page || options.page === 0){
      query = `${query}&page=${options.page + 1}`
    }

    if(options.pageSize){
      query = `${query}&pageSize=${options.pageSize}`
    }

    if(options?.orderBy) {
      query = `${query}&orderBy=${options.orderBy}`
    }

    if(options?.orderDirection) {
      query = `${query}&order=${options.orderDirection}`
    }
    
    return query;
  }
}


export function getInitialPagination(data:Array<any>) {
  if (data?.length <= 5) {
    return 5
  } else if (data?.length <= 10) {
    return 10
  } else return 20
}
