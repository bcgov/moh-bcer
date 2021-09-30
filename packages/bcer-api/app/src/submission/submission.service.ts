import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { GenericException } from 'src/common/generic-exception';

import { SubmissionDTO, UpdateSubmissionDTO } from 'src/submission/dto/submission.dto';
import { SubmissionEntity } from 'src/submission/entities/submission.entity';
import { SubmissionTypeEnum } from 'src/submission/enums/submission.enum';
import { SubmissionError } from 'src/submission/submission.error';

import { BusinessService } from 'src/business/business.service';
import { LocationService } from 'src/location/location.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class SubmissionService {
  constructor(
    private readonly businessService: BusinessService,
    private readonly locationService: LocationService,
    private readonly productsService: ProductsService,
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
  ) { }

  async createSubmission(dto: SubmissionDTO) {
    let business = await this.businessService.getBusinessById(dto.businessId);
    if (!business) {
      business = await this.businessService.createBusiness();
    }
    const createSubmission = this.submissionRepository.create({ ...dto, business });
    const createdSubmission = await this.submissionRepository.save(createSubmission);
    const submission = await this.getOne(createdSubmission.id);
    return submission;
  }

  async updateSubmission(dto: UpdateSubmissionDTO, id?: string) {
    const submission = await this.getOne(dto.submissionId || id);
    const updateSubmission = this.submissionRepository.create({
      ...submission,
      data: {
        ...submission.data,
        ...dto.data
      }
    })
    await this.submissionRepository.save(updateSubmission, { chunk: 500 });
    const returnSubmission = await this.getOne(dto.submissionId);
    return returnSubmission;
  }

  async getOne(id: string) {
    try {
      const submission = await this.submissionRepository.findOne(id, {
        relations: ['business']
      });
      return submission;
    } catch (error) {
      throw new GenericException(SubmissionError.FAILED_TO_GET_SUBMISSION, error)
    }
  }

  async getSubmissions() {
    // todo employ query builder to filter submissions
    const submission = await this.submissionRepository.find({
      relations: ['business']
    });
    return submission;
  }

  async clearSubmissions() {
    await this.submissionRepository.delete({});
    return
  }

  async mapSubmission(submissionId: string, { data }: UpdateSubmissionDTO) {
    const submission = await this.submissionRepository.findOne({ id: submissionId }, { relations: ['business'] });
    const mapping = data.mapping;
    // apply mapping and save based on the type
    // CASE type is location: parse data and create entries in locations table
    switch (submission.type) {

      case SubmissionTypeEnum.location:
        const providedLocations = submission.data.locations;
        if (!providedLocations) throw new Error('No locations were found on this submission')
        const mappedLocations = providedLocations.map((location: Object) => {
          let mappedLocation = {}
          for (let k in mapping) {
            mappedLocation[k] = mapping[k] ? location[mapping[k]] : ''
          }
          return mappedLocation
        })
        submission.data.locations = mappedLocations;
        break;

      case SubmissionTypeEnum.product:
        const products = submission.data.products
        if (!products) throw new Error('No products were found on this submission')
        const mappedProducts = products.map((product: Object) => {
          let mappedProduct = {}
          for (let k in mapping) {
            mappedProduct[k] = mapping[k] ? product[mapping[k]] : ''
          }
          return mappedProduct
        })
        submission.data.products = mappedProducts;
        break;

      case SubmissionTypeEnum.sales:
        const providedSaleReports = submission.data.saleReports;
        if (!providedSaleReports) throw new Error('No sales report were found on this submission')
        const mappedSaleReports = providedSaleReports.map((sale: Object) => {
          let mappedSaleReport = {}
          for (let k in mapping) {
            mappedSaleReport[k] = mapping[k] ? sale[mapping[k]] : ''
          }
          return mappedSaleReport
        })
        submission.data = data;
        submission.data.saleReports = mappedSaleReports;
        break;

      default:
        Logger.log(`no submission type match on ${submissionId}`)
        break;
    }
    const updatedSubmission = await this.updateSubmission({ submissionId, data: submission.data });
    return updatedSubmission;
  }

  async saveSubmission(submissionId: string) {
    const submission = await this.getOne(submissionId);
    switch (submission.type) {
      case SubmissionTypeEnum.location: {
        await this.locationService.createLocations(submission.data.locations, submission.business?.id);
        delete submission.data.details.locations;
        delete submission.data.details.nois;
        delete submission.data.details.products;
        delete submission.data.details.manufactures;
        delete submission.data.details.submissions;
        delete submission.data.details.users;
        if (submission.business.legalName && submission.business.email) {
          await this.businessService.saveBusiness(submission.data.details);
        } else {
          await this.businessService.createBusiness({ ...submission.business, ...submission.data.details });
        }
        // TODO create notification settings entity, linked to business entity
        break;
      }
      case SubmissionTypeEnum.product: {
        await this.productsService.createProducts(submission.data.products, submission.business.id);
        break;
      }
      default:
        break;
    }
    return submission;
  }
}
