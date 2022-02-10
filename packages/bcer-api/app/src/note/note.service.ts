import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessEntity } from "src/business/entities/business.entity";
import { LocationEntity } from "src/location/entities/location.entity";
import { UserEntity } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { NoteEntity } from "./entities/note.entity";

@Injectable()
export class NoteService {
  constructor(@InjectRepository(NoteEntity) private noteRepository: Repository<NoteEntity>){}

  async create(content: string, user: UserEntity, business?: BusinessEntity, location?: LocationEntity){
    const note = this.noteRepository.create({
      content,
      user,
      business,
      location,
    });

    await this.noteRepository.save(note);
  }

  async getNoteForLocationOrBusiness(targetId: string){
    const qb = this.noteRepository.createQueryBuilder('note')
      .leftJoinAndSelect('note.user', 'user')
      .where('note.locationId = :targetId', {targetId})
      .orWhere('note.businessId = :targetId', {targetId})
      .orderBy('note.createdAt', 'ASC')

      return await qb.getMany();
  }
}