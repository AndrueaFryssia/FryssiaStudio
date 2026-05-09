import { useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Transformer } from "react-konva";
import useImage from "use-image";

const DraggableSticker = ({ src, id, x, y, scaleX, scaleY, rotation, isSelected, onSelect, onChange }) => {
  // Generate stable cache-buster on mount to avoid repeated reloads
  const [cacheBuster] = useState(() => Date.now());
  
  // Fix CORS + Support local URL (blob)
  const isLocal = src.startsWith("blob:");
  const safeSrc = isLocal 
    ? src 
    : (src.includes("?") 
        ? `${src}&t=${cacheBuster}` 
        : `${src}?t=${cacheBuster}`);
  
  const [image] = useImage(safeSrc, "anonymous");
  const imgRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && imgRef.current) {
      trRef.current.nodes([imgRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        ref={imgRef} image={image} x={x} y={y} width={80} height={80}
        scaleX={scaleX || 1} scaleY={scaleY || 1} rotation={rotation || 0}
        draggable
        onClick={() => onSelect(id)} onTap={() => onSelect(id)}
        onDragEnd={(e) => onChange(id, { x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = imgRef.current;
          onChange(id, { x: node.x(), y: node.y(), scaleX: Math.max(node.scaleX(), 0.1), scaleY: Math.max(node.scaleY(), 0.1), rotation: node.rotation() });
        }}
      />
      {isSelected && (
        <Transformer ref={trRef} enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]} boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 ? oldBox : newBox)} />
      )}
    </>
  );
};

export default DraggableSticker;