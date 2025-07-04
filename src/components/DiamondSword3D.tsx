import React from 'react';
import goldenSword from '../assets/golden-sword.png';


type SwordIconProps = {
    width?: number;
    height?: number;
    className?: string;
};

const SwordIcon: React.FC<SwordIconProps> = ({ width = 50, height = 50, className }) => {
    return (
        <img
            src={goldenSword}
            alt="Sword Icon"
            style={{ width, height }}
            className={className}
        />
    );
};

export default SwordIcon;