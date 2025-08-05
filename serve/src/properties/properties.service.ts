import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '@/properties/entities/property.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Developer } from '@/developers/entities/developer.entity';
import { Agent } from '@/agents/entities/agent.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,

    @InjectRepository(Developer)
    private readonly developerRepository: Repository<Developer>,

    @InjectRepository(PropertyImage)
    private readonly propertyImageRepository: Repository<PropertyImage>,

    @InjectRepository(PropertyFloorPlan)
    private readonly propertyFloorPlanRepository: Repository<PropertyFloorPlan>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    property_images: Express.Multer.File[],
    property_floor_plans: Express.Multer.File[],
  ) {
    console.log('createPropertyDto:', createPropertyDto);
    // console.log('property_images:', property_images);
    // console.log('property_floor_plans:', property_floor_plans);
    try {
      const slug = slugify(createPropertyDto.name, { lower: true });
      const exitingSlug = await this.propertyRepository.findOneBy({ slug });
      if (exitingSlug) {
        throw new ConflictException(
          `Name property ${createPropertyDto.name} alredy exit`,
        );
      }

      const property = new Property();
      property.name = createPropertyDto.name;
      property.slug = slug;
      property.status = createPropertyDto.status;
      property.price = createPropertyDto.price;
      property.price_unit = createPropertyDto.price_unit;
      property.currency = createPropertyDto.currency;
      property.description = createPropertyDto.description;
      property.address = createPropertyDto.address;
      property.specifications = createPropertyDto.specifications;

      if (createPropertyDto.location) {
        try {
          const parsedLocation =
            typeof createPropertyDto.location === 'string'
              ? JSON.parse(createPropertyDto.location)
              : createPropertyDto.location;

          if (
            parsedLocation.type === 'Point' &&
            Array.isArray(parsedLocation.coordinates)
          ) {
            property.location = parsedLocation;
          } else {
            throw new Error('Invalid GeoJSON object');
          }
        } catch (err) {
          throw new BadRequestException('Invalid location format');
        }
      }

      if (createPropertyDto.agentId) {
        const agent = await this.agentRepository.findOneBy({
          id: createPropertyDto.agentId,
        });
        if (!agent)
          throw new NotFoundException(
            `Agent with id ${createPropertyDto.agentId} not found`,
          );

        property.agent = agent;
      }

      if (createPropertyDto.developerId) {
        const developer = await this.developerRepository.findOneBy({
          id: createPropertyDto.developerId,
        });
        if (!developer)
          throw new NotFoundException(
            `Developer with id ${createPropertyDto.developerId} not found`,
          );

        property.developer = developer;
      }

      const saveProperty = await this.propertyRepository.save(property);

      if (property_images && createPropertyDto.images) {
        const images = property_images.map((file, index) => {
          const metadata = createPropertyDto.images[index];
          return this.propertyImageRepository.create({
            image_url: file.filename,
            caption: metadata.caption,
            sort_order: metadata.sort_order || index,
            property: saveProperty,
          });
        });
        await this.propertyImageRepository.save(images);
      }

      if (property_floor_plans && createPropertyDto.floor_plans) {
        const floor_plan = property_floor_plans.map((file, index) => {
          const metadata = createPropertyDto.floor_plans[index];
          return this.propertyFloorPlanRepository.create({
            name: metadata.name,
            file_url: file.filename,
            sort_order: metadata.sort_order || index,
            property: saveProperty,
          });
        });
        await this.propertyFloorPlanRepository.save(floor_plan);
      }

      return saveProperty;
    } catch (error) {
      throw new InternalServerErrorException('Internal server eroro', {
        cause: new Error(),
        description: `error yang terjadi ${error}`,
      });
    }
  }

  async findAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      relations: ['developer', 'agent', 'images', 'floor_plans'],
    });
  }

  async findOne(id: string): Promise<Property | null> {
    return await this.propertyRepository.findOne({
      where: { id },
      relations: ['developer', 'agent', 'images', 'floor_plans'],
    });
  }

  update(id: number, updatePropertyDto: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  async remove(id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['developer', 'agent', 'images', 'floor_plans'],
    });

    if (!property) throw new NotFoundException('Property not found');

    if (property.images.length > 0) {
      for (const image of property.images) {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads/property/property_images',
          image.image_url,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    if (property.floor_plans.length > 0) {
      for (const floor_plan of property.floor_plans) {
        const filePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads/property/property_floor_plans',
          floor_plan.file_url,
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    await this.propertyRepository.remove(property);
    return { message: 'Delete successful' };
  }
}
