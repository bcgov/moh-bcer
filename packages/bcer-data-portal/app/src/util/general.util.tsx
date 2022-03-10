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

    return query;
  }
}