// ResizableBox.js
import React, { useRef } from 'react';
import '../styles/ResizableBox.css';  // Import CSS file for styling

const ResizableBox = ({ children }) => {
    const boxRef = useRef(null);

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = boxRef.current.offsetWidth;

        const handleMouseMove = (e) => {
            const newWidth = startWidth + e.clientX - startX;
            boxRef.current.style.width = `${newWidth}px`;
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div className="resizable-box" ref={boxRef}>
            {children}
            <div className="resizer" onMouseDown={handleMouseDown} />
        </div>
    );
};

export default ResizableBox;