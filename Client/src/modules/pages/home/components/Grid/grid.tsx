// components/PinterestGrid/GridItem.tsx
import Image from 'next/image';
import styles from './grid.module.scss';

type GridItemProps = {
  imageUrl: string;
};

const GridItem = ({ imageUrl }: GridItemProps) => {
  return (
    <div className={styles.gridItem}>
      <Image
        src={imageUrl}
        alt="Pinterest-style grid item"
        width={500} // Placeholder width, will be overridden by CSS
        height={500} // Placeholder height, will be overridden by CSS
        className={styles.image}
      />
      {/* You can add more content here like a title or buttons */}
    </div>
  );
};

export default GridItem;