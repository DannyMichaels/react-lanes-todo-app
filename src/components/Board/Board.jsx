// hooks
import useBoard from '../../hooks/useBoard';

// components
import { DragDropContext } from '@hello-pangea/dnd';
import Lane from '../Lane';

// styles
import './Board.css';

const Board = ({ lanes = [], title = '' }) => {
  const {
    boardLanes,
    isDragging,
    itemReachedLastLane,
    handleOnDragStart,
    handleOnDragEnd,
    handleBoardNewItemFormChange,
    addItem,
    deleteItem,
  } = useBoard(lanes);

  return (
    <div className="Board__container">
      <h1 className="Board__title">{title}</h1>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={handleOnDragStart}>
        <div className="Board__lanes__container">
          {boardLanes.map((lane) => (
            <Lane
              key={lane.id}
              lane={lane}
              isDragging={isDragging}
              onInputChange={(value) =>
                handleBoardNewItemFormChange(lane.id, value)
              }
              onAddItemClick={() => addItem(lane.id, lane.newItemContent)}
              onItemDeleteClick={(itemId) => deleteItem(lane.id, itemId)}
              itemReachedLastLane={itemReachedLastLane}
              isLastLane={lane.id === boardLanes[boardLanes.length - 1].id}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Board;
