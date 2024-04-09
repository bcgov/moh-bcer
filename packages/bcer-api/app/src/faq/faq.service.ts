import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FaqDTO } from "./dto/faq.dto";
import { FaqEntity } from "./entities/faq.entity";

@Injectable()
export class FaqService {
  constructor(@InjectRepository(FaqEntity) private faqRepository: Repository<FaqEntity>){}

  async create(payload: FaqDTO){
    if (payload.id === '') delete payload.id;
    const faqList = this.faqRepository.create(payload);

    await this.faqRepository.save(faqList);
  }

  async getFaqList(){
    // There will only ever be one faqList
    const faqList = await this.faqRepository.findOne({});
    if (faqList) {
      return faqList;
    } else {
      return {id: null, content: JSON.stringify([])}
    }
  }
}