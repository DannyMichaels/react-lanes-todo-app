import { memo } from 'react';

// hooks
import useDraggableInPortal from '../../hooks/useDraggableInPortal';

// components
import { Droppable, Draggable } from '@hello-pangea/dnd';
import LaneItem from '../LaneItem';
import ConfettiExplosion from 'react-confetti-explosion';
import { Button, GlassmorphismHeader, Input } from '../shared';

/// styles
import './Lane.css';

const Lane = memo(
  ({
    lane,
    onInputChange,
    isDragging,
    onAddItemClick,
    onItemDeleteClick,
    itemReachedLastLane,
    isLastLane,
  }) => {
    const renderDraggable = useDraggableInPortal();

    return (
      <div className="Lane__container">
        {isLastLane && itemReachedLastLane ? <ConfettiExplosion /> : null}

        <GlassmorphismHeader>
          <h2 className="Lane__header__title">{lane.title}</h2>
        </GlassmorphismHeader>

        <div className="Lane__content">
          <Droppable droppableId={lane.id}>
            {(provided) => (
              <div
                className="Lane__items__container"
                ref={provided.innerRef}
                {...provided.droppableProps}>
                {lane.items.map((item, itemIndex) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={itemIndex}>
                    {renderDraggable((provided, snapshot) => (
                      <LaneItem
                        item={item}
                        provided={provided}
                        snapshot={snapshot}
                        isDragging={isDragging}
                        onItemDeleteClick={onItemDeleteClick}
                      />
                    ))}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <footer className="Lane__footer">
          <div className="Lane__footer__item">
            <Input
              type="text"
              placeholder="Add a new item..."
              value={lane.newItemContent}
              onChange={(e) => onInputChange(e.target.value)}
            />
          </div>
          <div className="Lane__footer__item">
            <Button onClick={onAddItemClick}>Add Item</Button>
          </div>
        </footer>
      </div>
    );
  }
);

export default Lane;
