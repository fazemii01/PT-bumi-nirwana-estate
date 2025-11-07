import {useMemo} from 'react';
import {BACKEND_IMG, BACKEND_LOCALHOST} from '@utils/const';

interface PropertyImage {
    id: string;
    image_url: string;
    caption: string;
    sort_order: number;
}

interface SitePlan {
    id: string;
    name: string;
    file_url: string;
    sort_order: number;
}
interface floor_plans {
    id: string;
    name: string;
    file_url: string;
    sort_order: number;
}

interface IGalleryList {
    original: string;
    thumbnail: string;
    video?: string;
}

const usePropertyPhoto = (images: PropertyImage[] = [], sitePlans: SitePlan[] = [], floor_plans: floor_plans[] = []): IGalleryList[] => {
    // const getImagePath = (fileName: string) => `${BACKEND_IMG}/storage/v1/object/public/property_images/${fileName}`;
    // const getFloorPlanPath = (fileName: string) => `${BACKEND_IMG}/storage/v1/object/public/property_site_plans/${fileName}`;

    const fileList = useMemo(() => {
        const allFiles = [
            ...images.map(img => ({...img, type: 'image'})),
            ...sitePlans.map(plan => ({...plan, type: 'site_plan'})),
            ...floor_plans.map(plan => ({ ...plan, type: 'floor_plans' })),
        ];

        allFiles.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        return allFiles.map(file => {
            const videoRegExp = /(mp4|webm|mov)/;
            const isImage = file.type === 'image';
            const fileName = isImage ? (file as PropertyImage).image_url : (file as SitePlan).file_url;
            const isVideo = videoRegExp.test(fileName);
            const filePath = isImage
                ? (file as PropertyImage).image_url
                : (file as SitePlan).file_url;

            return {
                original: filePath,
                thumbnail: filePath,
                video: isVideo ? filePath : undefined,
            };
        });
    }, [images, sitePlans]);

    return fileList;
};

export default usePropertyPhoto;
