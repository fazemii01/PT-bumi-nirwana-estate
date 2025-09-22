import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingPropertyDto } from './dto/create-building_property.dto';
import { UpdateBuildingPropertyDto } from './dto/update-building_property.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '@/properties/entities/property.entity';
import { Repository } from 'typeorm';
import { BuildingImages } from '@/building_property/entities/building_images.entity';
import { BuildingFloorPlans } from '@/building_property/entities/building_floor_plans.entity';
import { BuildingProperty } from '@/building_property/entities/building_property.entity';
import { DeletedAtStatus, nowUtc } from '@/types/deleted_at';
import * as fs from 'fs';
import * as path from 'path';
import { BuildingKprRules } from '@/building_property/entities/building_kpr_rules.entity';

@Injectable()
export class BuildingPropertyService {
  constructor(
    @InjectRepository(BuildingProperty)
    private readonly buildingPropertyRepository: Repository<BuildingProperty>,
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,

    @InjectRepository(BuildingImages)
    private readonly buildingImagesRepository: Repository<BuildingImages>,

    @InjectRepository(BuildingFloorPlans)
    private readonly buildingFloorPlanRepository: Repository<BuildingFloorPlans>,

    @InjectRepository(BuildingKprRules)
    private readonly buildingKprRulesRepository: Repository<BuildingKprRules>,
  ) {}

  async create(
    createBuildingPropertyDto: CreateBuildingPropertyDto,
    building_images: Express.Multer.File[],
    building_floor_plans: Express.Multer.File[],
    building_kpr_rules: Express.Multer.File[],
  ) {
    try {
      const building = new BuildingProperty();
      building.name = createBuildingPropertyDto.name;
      building.status = createBuildingPropertyDto.status;
      building.status = createBuildingPropertyDto.status;
      building.price = createBuildingPropertyDto.price;
      building.land_size = createBuildingPropertyDto.land_size;
      building.building_size = createBuildingPropertyDto.building_size;
      building.price_unit = createBuildingPropertyDto.price_unit;
      building.description = createBuildingPropertyDto.description;
      building.specifications = createBuildingPropertyDto.specifications;

      if (createBuildingPropertyDto.propertyId) {
        const property = await this.propertyRepository.findOneBy({
          id: createBuildingPropertyDto.propertyId,
        });
        if (!property)
          throw new NotFoundException(
            `Property with id ${createBuildingPropertyDto.propertyId} not found`,
          );

        building.property = property;
      }

      const saveBuilding = await this.buildingPropertyRepository.save(building);

      if (building_images) {
        if (createBuildingPropertyDto.images) {
          const images = building_images.map((file, index) => {
            const metadata = createBuildingPropertyDto.images?.[index] ?? {};
            return this.buildingImagesRepository.create({
              image_url: file.filename,
              caption: metadata.caption || '',
              sort_order: metadata.sort_order || index,
              building_property: saveBuilding,
            });
          });
          await this.buildingImagesRepository.save(images);
        } else {
          const images = building_images.map((file) => {
            return this.buildingImagesRepository.create({
              image_url: file.filename,
              building_property: saveBuilding,
            });
          });
          await this.buildingImagesRepository.save(images);
        }
      }

      if (building_floor_plans && createBuildingPropertyDto.floor_plans) {
        const building_plan = building_floor_plans.map((file, index) => {
          const metadata = createBuildingPropertyDto.floor_plans[index];
          return this.buildingFloorPlanRepository.create({
            name: metadata.name,
            file_url: file.filename,
            sort_order: metadata.sort_order || index,
            building_property: saveBuilding,
          });
        });
        await this.buildingFloorPlanRepository.save(building_plan);
      }

      if (building_kpr_rules) {
        const rules = building_kpr_rules.map((file) => {
          return this.buildingKprRulesRepository.create({
            file_url: file.filename,
            building_property: saveBuilding,
          });
        });
        await this.buildingKprRulesRepository.save(rules);
      }

      return saveBuilding;
    } catch (error) {
      throw new InternalServerErrorException('Internal server eroro', {
        cause: new Error(),
        description: `error yang terjadi ${error}`,
      });
    }
  }

  async findAll(): Promise<BuildingProperty[]> {
    return await this.buildingPropertyRepository.find({
      where: { status_delete: DeletedAtStatus.NOT_DELETED },
      relations: ['property', 'images', 'floor_plans', 'building_kpr_rules'],
    });
  }

  async findOne(id: string): Promise<BuildingProperty | null> {
    return await this.buildingPropertyRepository.findOne({
      where: { id },
      relations: ['property', 'images', 'floor_plans', 'building_kpr_rules'],
    });
  }

  async update(
    id: string,
    updateBuildingPropertyDto: UpdateBuildingPropertyDto,
    building_images: Express.Multer.File[],
    building_floor_plans: Express.Multer.File[],
    building_kpr_rules: Express.Multer.File[],
  ) {
    try {
      const building = await this.buildingPropertyRepository.findOne({
        where: { id },
        relations: ['property', 'images', 'floor_plans', 'building_kpr_rules'],
      });
      if (!building) throw new NotFoundException(`building property not found`);

      if (building_images && building_images.length > 0) {
        for (const images of building.images) {
          this.deleteFileFromUploads('building_images', images.image_url);
        }
        await this.buildingImagesRepository.remove(building.images);
      }

      if (building_floor_plans && building_floor_plans.length > 0) {
        for (const floorPlan of building.floor_plans) {
          this.deleteFileFromUploads('building_site_plans', floorPlan.file_url);
        }
        await this.buildingFloorPlanRepository.remove(building.floor_plans);
      }

      if (building_kpr_rules && building_kpr_rules.length > 0) {
        for (const rules of building.building_kpr_rules) {
          this.deleteFileFromUploads('building_kpr_rules', rules.file_url);
        }
        await this.buildingKprRulesRepository.remove(
          building.building_kpr_rules,
        );
      }

      Object.assign(building, updateBuildingPropertyDto);

      if (updateBuildingPropertyDto.propertyId) {
        const property = await this.propertyRepository.findOneBy({
          id: updateBuildingPropertyDto.propertyId,
        });
        if (!property)
          throw new NotFoundException(
            `Property with id ${updateBuildingPropertyDto.propertyId} not found`,
          );

        building.property = property;
      }

      if (
        building_images &&
        building_images.length > 0 &&
        updateBuildingPropertyDto.images
      ) {
        const newImages = building_images.map((file, index) => {
          const metadata = updateBuildingPropertyDto.images?.[index] ?? {};
          return this.buildingImagesRepository.create({
            caption: metadata.caption || '',
            image_url: file.filename,
            building_property: building,
          });
        });
        await this.buildingImagesRepository.save(newImages);
        building.images = newImages;
      } else {
        const newImages = building_images.map((file) => {
          return this.buildingImagesRepository.create({
            image_url: file.filename,
            building_property: building,
          });
        });
        await this.buildingImagesRepository.save(newImages);
        building.images = newImages;
      }

      if (
        building_floor_plans &&
        building_floor_plans.length > 0 &&
        updateBuildingPropertyDto.floor_plans
      ) {
        const newFloorPlan = building_floor_plans.map((file, index) => {
          console.log(` site plan ${index + 1}: ${file.filename}`);
          const metadata = updateBuildingPropertyDto.floor_plans?.[index];
          return this.buildingFloorPlanRepository.create({
            name: metadata?.name || `Site Plan ${index + 1}`,
            file_url: file.filename,
            sort_order: metadata?.sort_order || index,
            building_property: building,
          });
        });
        await this.buildingFloorPlanRepository.save(newFloorPlan);
        building.floor_plans = newFloorPlan;
      }

      if (building_kpr_rules && building_kpr_rules.length > 0) {
        const newRules = building_kpr_rules.map((file) => {
          return this.buildingKprRulesRepository.create({
            file_url: file.filename,
          });
        });
        await this.buildingKprRulesRepository.save(newRules);
        building.building_kpr_rules = newRules;
      }
      return await this.buildingPropertyRepository.save(building);
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
    const building = await this.buildingPropertyRepository.findOne({
      where: { id },
      relations: ['property', 'images', 'floor_plans', 'building_kpr_rules'],
    });

    if (!building) throw new NotFoundException('building property not found');

    if (building.images.length > 0) {
      for (const image of building.images) {
        this.deleteFileFromUploads('building_images', image.image_url);
      }
    }

    if (building.floor_plans.length > 0) {
      for (const floorPlan of building.floor_plans) {
        this.deleteFileFromUploads('building_floor_plans', floorPlan.file_url);
      }
    }

    if (building.building_kpr_rules.length > 0) {
      for (const buildingKpr of building.building_kpr_rules) {
        this.deleteFileFromUploads('building_kpr_rules', buildingKpr.file_url);
      }
    }

    await this.buildingPropertyRepository.update(
      { id },
      { status_delete: DeletedAtStatus.DELETED, deleted_at: nowUtc() },
    );
    return { message: 'Delete successful' };
  }

  private async deleteFileFromUploads(subFolder: string, filename: string) {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      `uploads/building_property/${subFolder}`,
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
