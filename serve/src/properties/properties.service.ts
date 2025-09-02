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
import { Property, PropertyType } from '@/properties/entities/property.entity';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Developer } from '@/developers/entities/developer.entity';
import { Agent } from '@/agents/entities/agent.entity';
import { PropertyImage } from '@/properties/entities/property-image.entity';
import { PropertyFloorPlan } from '@/properties/entities/property-floor-plan.entity';
import * as path from 'path';
import * as fs from 'fs';
import { UpdatePropertyImagesDto } from '@/properties/dto/update-property-images.dto';
import { UpdatePropertyFloorPlansDto } from '@/properties/dto/update-property-floor-plans.dto';

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
      property.type = createPropertyDto.type;
      property.status = createPropertyDto.status;
      property.price = createPropertyDto.price;
      property.land_size = createPropertyDto.land_size;
      property.building_size = createPropertyDto.building_size;
      property.price_unit = createPropertyDto.price_unit;
      property.description = createPropertyDto.description;
      property.detail_description = createPropertyDto.description;
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

      if (property_images) {
        if (createPropertyDto.images) {
          const images = property_images.map((file, index) => {
            const metadata = createPropertyDto.images?.[index] ?? {};
            return this.propertyImageRepository.create({
              image_url: file.filename,
              caption: metadata.caption || '',
              sort_order: metadata.sort_order || index,
              property: saveProperty,
            });
          });
          await this.propertyImageRepository.save(images);
        } else {
          const images = property_images.map((file) => {
            return this.propertyImageRepository.create({
              image_url: file.filename,
              property: saveProperty,
            });
          });
          await this.propertyImageRepository.save(images);
        }
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

  async findOneByType(type: string): Promise<Property[]> {
    if (!Object.values(PropertyType).includes(type as PropertyType)) {
      throw new BadRequestException(`Invalid property type: ${type}`);
    }

    const properties = await this.propertyRepository.find({
      where: { type: type as PropertyType },
      relations: ['developer', 'agent', 'images', 'floor_plans'],
    });
    if (!properties || properties.length === 0) {
      throw new NotFoundException(`Property with type ${type} not found`);
    }
    return properties;
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    property_images: Express.Multer.File[],
    property_floor_plans: Express.Multer.File[],
  ) {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: ['developer', 'agent', 'images', 'floor_plans'],
      });
      if (!property) throw new NotFoundException(`Property not found`);

      if (property_images && property_images.length > 0) {
        for (const image of property.images) {
          this.deleteFileFromUploads('property_images', image.image_url);
        }
        await this.propertyImageRepository.remove(property.images);
      }

      if (property_floor_plans && property_floor_plans.length > 0) {
        for (const floorPlan of property.floor_plans) {
          this.deleteFileFromUploads(
            'property_floor_plans',
            floorPlan.file_url,
          );
        }
        await this.propertyFloorPlanRepository.remove(property.floor_plans);
      }

      Object.assign(property, updatePropertyDto);

      if (updatePropertyDto.name) {
        const slug = slugify(updatePropertyDto.name, { lower: true });
        if (slug !== property.slug) {
          const exitingSlug = await this.propertyRepository.findOne({
            where: { slug },
          });
          if (exitingSlug)
            throw new ConflictException(
              `Name property with ${updatePropertyDto.name} alredy exit`,
            );
        }
        property.slug = slug;
        property.name = updatePropertyDto.name;
      }

      if (updatePropertyDto.location) {
        console.log(updatePropertyDto.location);

        try {
          const parsedLocation =
            typeof updatePropertyDto.location === 'string'
              ? JSON.parse(updatePropertyDto.location)
              : updatePropertyDto.location;

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

      if (updatePropertyDto.agentId) {
        const agent = await this.agentRepository.findOneBy({
          id: updatePropertyDto.agentId,
        });
        if (!agent)
          throw new NotFoundException(
            `Agent with id ${updatePropertyDto.agentId} not found`,
          );

        property.agent = agent;
      }

      if (updatePropertyDto.developerId) {
        const developer = await this.developerRepository.findOneBy({
          id: updatePropertyDto.developerId,
        });
        if (!developer)
          throw new NotFoundException(
            `Developer with id ${updatePropertyDto.developerId} not found`,
          );

        property.developer = developer;
      }

      if (
        property_images &&
        property_images.length > 0 &&
        updatePropertyDto.images
      ) {
        const newImages = property_images.map((file, index) => {
          const metadata = updatePropertyDto.images?.[index] ?? {};
          return this.propertyImageRepository.create({
            caption: metadata.caption || '',
            image_url: file.filename,
            property: property,
          });
        });
        await this.propertyImageRepository.save(newImages);
        property.images = newImages;
      } else {
        const newImages = property_images.map((file) => {
          return this.propertyImageRepository.create({
            image_url: file.filename,
            property: property,
          });
        });
        await this.propertyImageRepository.save(newImages);
        property.images = newImages;
      }

      if (
        property_floor_plans &&
        property_floor_plans.length > 0 &&
        updatePropertyDto.floor_plans
      ) {
        const newFloorPlans = property_floor_plans.map((file, index) => {
          console.log(` floor plan ${index + 1}: ${file.filename}`);
          const metadata = updatePropertyDto.floor_plans?.[index];
          return this.propertyFloorPlanRepository.create({
            name: metadata?.name || `Floor Plan ${index + 1}`,
            file_url: file.filename,
            sort_order: metadata?.sort_order || index,
            property: property,
          });
        });
        await this.propertyFloorPlanRepository.save(newFloorPlans);
        property.floor_plans = newFloorPlans;
      }
      return await this.propertyRepository.save(property);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
    }
  }

  async remove(id: string) {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['developer', 'agent', 'images', 'floor_plans'],
    });

    if (!property) throw new NotFoundException('Property not found');

    if (property.images.length > 0) {
      for (const image of property.images) {
        this.deleteFileFromUploads('property_images', image.image_url);
      }
    }

    if (property.floor_plans.length > 0) {
      for (const floor_plan of property.floor_plans) {
        this.deleteFileFromUploads('property_floor_plans', floor_plan.file_url);
      }
    }

    await this.propertyRepository.remove(property);
    return { message: 'Delete successful' };
  }

  private async deleteFileFromUploads(subFolder: string, filename: string) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      `uploads/property/${subFolder}`,
      filename,
    );
    try {
      await fs.promises.unlink(filePath);
      console.log(`Deleted file: ${filename}`);
    } catch (err) {
      console.error(`Could not delete file ${filename}:`, err.message);
    }
  }
}
