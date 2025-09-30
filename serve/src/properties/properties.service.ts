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
import { PropertyImage } from '@/properties/entities/property_images.entity';
import * as path from 'path';
import * as fs from 'fs';
import { DeletedAtStatus, nowUtc } from '@/types/deleted_at';
import { PropertySitePlan } from '@/properties/entities/property_site_plans.entity';
import { CreatePropertyImageDto } from '@/properties/dto/create-property-image.dto';
import { CreatePropertySitePlansDto } from '@/properties/dto/create-property-site-plans.dto';

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

    @InjectRepository(PropertySitePlan)
    private readonly propertySitePlanRepository: Repository<PropertySitePlan>,
  ) {}

  async create(
    createPropertyDto: CreatePropertyDto,
    property_images: Express.Multer.File[],
    property_site_plans: Express.Multer.File[],
  ) {
    try {
      const slug = slugify(createPropertyDto.name, { lower: true });
      const exitingSlug = await this.propertyRepository.findOneBy({ slug });
      if (exitingSlug) {
        throw new ConflictException(
          `Name properti ${createPropertyDto.name} alredy exit`,
        );
      }

      const property = new Property();
      property.name = createPropertyDto.name;
      property.slug = slug;
      property.type = createPropertyDto.type;
      property.description = createPropertyDto.description;
      property.detail_description = createPropertyDto.description;
      property.address = createPropertyDto.address;

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
              caption: metadata.caption ?? '_',
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

      if (property_site_plans && createPropertyDto.site_plans) {
        const site_plan = property_site_plans.map((file, index) => {
          const metadata = createPropertyDto.site_plans[index];
          return this.propertySitePlanRepository.create({
            name: metadata.name,
            file_url: file.filename,
            sort_order: metadata.sort_order || index,
            property: saveProperty,
          });
        });
        await this.propertySitePlanRepository.save(site_plan);
      }

      return saveProperty;
    } catch (error) {
      throw new InternalServerErrorException('Internal server eroro', {
        cause: new Error(),
        description: `error yang terjadi ${error}`,
      });
    }
  }

  async createImageProperty(
    propertyId: string,
    property_images: Express.Multer.File[],
    images: CreatePropertyImageDto[],
  ): Promise<PropertyImage[]> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['developer', 'agent', 'images', 'site_plans'],
    });

    if (!property) {
      throw new NotFoundException(`Property not found`);
    }

    const imageEntities = property_images.map((file, index) => {
      const metadata = images?.[index] ?? {};

      return this.propertyImageRepository.create({
        image_url: file.filename,
        caption: metadata.caption ?? '_',
        sort_order: metadata.sort_order ?? index,
        property: property,
      });
    });

    const savedImages = await this.propertyImageRepository.save(imageEntities);

    return savedImages;
  }

  async createSitePlanProperty(
    propertyId: string,
    property_site_plans: Express.Multer.File[],
    site_plans: CreatePropertySitePlansDto[],
  ): Promise<PropertySitePlan[]> {
    console.log(site_plans);

    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['developer', 'agent', 'images', 'site_plans'],
    });

    if (!property) {
      throw new NotFoundException(`Property not found`);
    }

    const sitePlanEntities = property_site_plans.map((file, index) => {
      const metadata = site_plans?.[index] ?? {};
      console.log(metadata);

      return this.propertySitePlanRepository.create({
        name: metadata.name ?? '_',
        file_url: file.filename,
        sort_order: metadata.sort_order || index,
        property: property,
      });
    });

    const saveSitePlan =
      await this.propertySitePlanRepository.save(sitePlanEntities);

    return saveSitePlan;
  }

  async findAll(): Promise<Property[]> {
    const properties = await this.propertyRepository.find({
      where: {
        status_delete: DeletedAtStatus.NOT_DELETED,
        building_property: { status_delete: DeletedAtStatus.NOT_DELETED },
      },
      relations: [
        'developer',
        'agent',
        'images',
        'site_plans',
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
      ],
    });

    return this.addFavoritesCount(properties);
  }

  async findOne(id: string): Promise<Property | null> {
    const properties = await this.propertyRepository.findOne({
      where: { id },
      relations: [
        'developer',
        'agent',
        'images',
        'site_plans',
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
      ],
    });
    if (!properties) return null;

    const [propertyWithCount] = await this.addFavoritesCount([properties]);
    return propertyWithCount;
  }

  async findByType(type: string): Promise<Property[]> {
    if (!Object.values(PropertyType).includes(type as PropertyType)) {
      throw new BadRequestException(`Invalid property type: ${type}`);
    }

    const properties = await this.propertyRepository.find({
      where: { type: type as PropertyType },
      relations: [
        'developer',
        'agent',
        'images',
        'site_plans',
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
      ],
    });
    if (!properties || properties.length === 0) {
      throw new NotFoundException(`Property with type ${type} not found`);
    }
    return this.addFavoritesCount(properties);
  }

  async update(
    id: string,
    updatePropertyDto: UpdatePropertyDto,
    property_images: Express.Multer.File[],
    property_site_plans: Express.Multer.File[],
  ) {
    try {
      const property = await this.propertyRepository.findOne({
        where: { id },
        relations: [
          'developer',
          'agent',
          'images',
          'site_plans',
          'building_property',
          'building_property.images',
          'building_property.floor_plans',
        ],
      });
      if (!property) throw new NotFoundException(`Property not found`);

      if (property_images && property_images.length > 0) {
        for (const image of property.images) {
          this.deleteFileFromUploads('property_images', image.image_url);
        }
        await this.propertyImageRepository.remove(property.images);
      }

      if (property_site_plans && property_site_plans.length > 0) {
        for (const sitePlan of property.site_plans) {
          this.deleteFileFromUploads('property_site_plans', sitePlan.file_url);
        }
        await this.propertySitePlanRepository.remove(property.site_plans);
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
        property_site_plans &&
        property_site_plans.length > 0 &&
        updatePropertyDto.site_plans
      ) {
        const newSitePlans = property_site_plans.map((file, index) => {
          console.log(` site plan ${index + 1}: ${file.filename}`);
          const metadata = updatePropertyDto.site_plans?.[index];
          return this.propertySitePlanRepository.create({
            name: metadata?.name || `Site Plan ${index + 1}`,
            file_url: file.filename,
            sort_order: metadata?.sort_order || index,
            property: property,
          });
        });
        await this.propertySitePlanRepository.save(newSitePlans);
        property.site_plans = newSitePlans;
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
      relations: [
        'developer',
        'agent',
        'images',
        'site_plans',
        'building_property',
        'building_property.images',
        'building_property.floor_plans',
      ],
    });

    if (!property) throw new NotFoundException('Property not found');

    if (property.images.length > 0) {
      for (const image of property.images) {
        this.deleteFileFromUploads('property_images', image.image_url);
      }
    }

    if (property.site_plans.length > 0) {
      for (const site_plan of property.site_plans) {
        this.deleteFileFromUploads('property_site_plans', site_plan.file_url);
      }
    }

    await this.propertyRepository.update(
      { id },
      { status_delete: DeletedAtStatus.DELETED, deleted_at: nowUtc() },
    );
    return { message: 'Delete successful' };
  }

  async deleteImageProperty(id: string) {
    const img = await this.propertyImageRepository.findOneBy({ id });
    if (!img) throw new NotFoundException();
    this.deleteFileFromUploads('property_images', img.image_url);
    await this.propertyImageRepository.delete(id);
    return { message: 'Successfull' };
  }

  async deleteSiteProperty(id: string) {
    const img = await this.propertySitePlanRepository.findOneBy({ id });
    if (!img) throw new NotFoundException();
    this.deleteFileFromUploads('property_site_plans', img.file_url);
    await this.propertySitePlanRepository.delete(id);
    return { message: 'Successfull' };
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

  private async addFavoritesCount(properties: Property[]): Promise<any[]> {
    if (!properties.length) return [];

    const ids = properties.map((p) => p.id);

    const favorites = await this.propertyRepository
      .createQueryBuilder('property')
      .leftJoin('property.favorites', 'favorite')
      .select('property.id', 'id')
      .addSelect('COUNT(favorite.propertyId)', 'favoritesCount')
      .where('property.id IN (:...ids)', { ids })
      .groupBy('property.id')
      .getRawMany();

    const favoritesMap = new Map(
      favorites.map((f) => [f.id, Number(f.favoritesCount)]),
    );

    return properties.map((p) => ({
      ...p,
      favoritesCount: favoritesMap.get(p.id) || 0,
    }));
  }
}
