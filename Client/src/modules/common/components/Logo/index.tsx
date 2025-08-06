import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Import your stylesheet
import s from './Logo.module.scss'; 

import NEW_LOGO from '../../../../assets/icons/20250801_140054.svg';

const Logo: FC<{ type?: 'white' | 'black' }> = ({ type = 'white' }) => {
    
    const width = 160; 
    const height = 80;

    return (
        
        <Link href="/" className={s['logo-container']}> 
            <Image
                src={NEW_LOGO}
                alt="Logo"
                width={width}
                height={height}
            />
        </Link>
    );
};

export default Logo;