import { useEffect, useRef } from "react";
import { Text as KonvaText, Transformer } from "react-konva";

const TextOverlay = ({ id, text, x, y, scaleX, scaleY, rotation, fontSize, color, fontFamily, isSelected, onSelect, onChange }) => {
  const textRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaText
        ref={textRef} text={text} x={x} y={y} fontSize={fontSize} fill={color} fontFamily={fontFamily}
        scaleX={scaleX || 1} scaleY={scaleY || 1} rotation={rotation || 0}
        draggable
        onClick={() => onSelect(id)} onTap={() => onSelect(id)}
        onDragEnd={(e) => onChange(id, { x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const node = textRef.current;
          onChange(id, { x: node.x(), y: node.y(), scaleX: Math.max(node.scaleX(), 0.1), scaleY: Math.max(node.scaleY(), 0.1), rotation: node.rotation() });
        }}
      />
      {isSelected && (
        <Transformer ref={trRef} enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]} boundBoxFunc={(oldBox, newBox) => (newBox.width < 10 ? oldBox : newBox)} />
      )}
    </>
  );
};

export default TextOverlay;