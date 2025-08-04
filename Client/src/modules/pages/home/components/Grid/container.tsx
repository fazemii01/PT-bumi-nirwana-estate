// components/PinterestGrid/PinterestGrid.tsx
import GridItem from './grid';
import styles from './grid.module.scss';

// Sample data - in a real app, this would come from an API
export const imageData = [
  { id: 1, url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952' },
  { id: 2, url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad' },
  { id: 3, url: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca' },
  { id: 4, url: 'https://images.unsplash.com/photo-1498758536662-35b82cd15e29' },
  { id: 5, url: 'https://images.unsplash.com/photo-1552664730-d307ca884978' },
  { id: 6, url: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea' },
  { id: 7, url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c' },
];


const PinterestGrid = () => {
  return (
    <div className={styles.gridContainer}>
      {imageData.map((item) => (
        <GridItem key={item.id} imageUrl={item.url} />
      ))}
    </div>
  );
};

export default PinterestGrid;