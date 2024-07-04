import { memo } from 'react';
import { Tooltip } from 'react-tooltip';
import truncate from '../../utils/truncate';
import './LaneItem.css';

const TRUNCATE_LENGTH = 25;

const LaneItem = memo(
  ({ item, onItemDeleteClick, provided, snapshot, isDragging }) => {
    const truncatedContent = truncate(item.content, TRUNCATE_LENGTH);

    const containerClassNames = [
      'LaneItem',
      snapshot.isDragging ? 'LaneItem--dragging' : '',
      isDragging && !snapshot.isDragging ? 'LaneItem--inactive' : '',
    ].join(' ');

    return (
      <div
        className={containerClassNames}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}>
        <div
          className="LaneItem__content"
          {...(item.content.length > TRUNCATE_LENGTH && {
            'data-tooltip-id': `content-${item.id}`,
            'data-tooltip-content': item.content,
          })}>
          {truncatedContent}
        </div>
        <div
          className="LaneItem__delete"
          data-tooltip-id={`delete-${item.id}`}
          data-tooltip-content={`Delete ${truncatedContent}?`}>
          <button onClick={() => onItemDeleteClick(item.id)}>X</button>
        </div>

        <Tooltip id={`delete-${item.id}`} />
        <Tooltip id={`content-${item.id}`} />
      </div>
    );
  }
);

export default LaneItem;
