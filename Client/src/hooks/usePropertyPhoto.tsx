import {useMemo} from 'react';
import {BACKEND_LOCALHOST} from '@utils/const';

interface PropertyImage {
    id: string;
    image_url: string;
    caption: string;
    sort_order: number;
}

interface FloorPlan {
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

const usePropertyPhoto = (images: PropertyImage[] = [], floorPlans: FloorPlan[] = []): IGalleryList[] => {
    const getImagePath = (fileName: string) => `${BACKEND_LOCALHOST}/uploads/property/property_images/${fileName}`;
    const getFloorPlanPath = (fileName: string) => `${BACKEND_LOCALHOST}/uploads/property/property_floor_plans/${fileName}`;

    const fileList = useMemo(() => {
        const allFiles = [
            ...images.map(img => ({...img, type: 'image'})),
            ...floorPlans.map(plan => ({...plan, type: 'floor_plan'}))
        ];

        allFiles.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

        return allFiles.map(file => {
            const videoRegExp = /(mp4|webm|mov)/;
            const isImage = file.type === 'image';
            const fileName = isImage ? (file as PropertyImage).image_url : (file as FloorPlan).file_url;
            const isVideo = videoRegExp.test(fileName);
            const filePath = isImage ? getImagePath(fileName) : getFloorPlanPath(fileName);

            return {
                original: filePath,
                thumbnail: filePath,
                video: isVideo ? filePath : undefined,
            };
        });
    }, [images, floorPlans]);

    return fileList;
};

export default usePropertyPhoto;