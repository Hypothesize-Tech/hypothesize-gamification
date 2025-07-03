import React from 'react';


type SwordIconProps = {
    width?: number;
    height?: number;
    className?: string;
};

const SwordIcon: React.FC<SwordIconProps> = ({ width = 50, height = 50, className }) => {
    return (
        <img
            src={'./../../public/golden-sword.png'}
            alt="Sword Icon"
            style={{ width, height }}
            className={className}
        />
    );
};

export default SwordIcon;