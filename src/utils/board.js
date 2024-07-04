import { generateId } from './id';

export const createInitialBoardState = (lanes) => ({
  lanes: lanes.map((lane) => ({
    id: lane.toLowerCase(),
    title: lane,
    items: localStorage.getItem(lane.toLowerCase())
      ? JSON.parse(localStorage.getItem(lane.toLowerCase()))
      : [],
    newItemContent: '',
  })),
});

export const findBoardLane = (lanes, id) =>
  lanes.find((lane) => lane.id === id);

export const copyLanesAndFindLane = (lanes, laneId) => {
  const copyLanes = [...lanes];
  const lane = findBoardLane(copyLanes, laneId);
  return [copyLanes, lane];
};

export const moveBoardItem = (
  lanes,
  source,
  destination,
  onItemReachedLastLane
) => {
  const [newLanes, sourceLane] = copyLanesAndFindLane(
    lanes,
    source.droppableId
  );

  const destinationLane = newLanes.find(
    (lane) => lane.id === destination.droppableId
  );
  const [removed] = sourceLane.items.splice(source.index, 1);
  destinationLane.items.splice(destination.index, 0, removed);

  handleItemReachedLastLane({
    itemId: removed.id,
    lanes: newLanes,
    destinationLaneId: destination.droppableId,
    sourceLaneId: source.droppableId,
    onItemReachedLastLane,
  });

  return newLanes;
};

export const constructBoardItem = (content) => ({
  id: generateId(),
  content,
});

export const addItemToBoardLane = (lanes, laneId) => {
  const [newLanes, lane] = copyLanesAndFindLane(lanes, laneId);
  if (!lane.newItemContent) return newLanes;
  lane.items = [...lane.items, constructBoardItem(lane.newItemContent)];

  return newLanes;
};

export const updateBoardLaneForm = (lanes, laneId, content) => {
  const [newLanes, lane] = copyLanesAndFindLane(lanes, laneId);
  lane.newItemContent = content;

  return newLanes;
};

export const deleteItemFromBoardLane = (lanes, laneId, itemId) => {
  const [newLanes, lane] = copyLanesAndFindLane(lanes, laneId);
  lane.items = lane.items.filter((item) => item.id !== itemId);

  return newLanes;
};

const handleItemReachedLastLane = ({
  itemId,
  lanes,
  destinationLaneId,
  sourceLaneId,
  onItemReachedLastLane,
}) => {
  const isLastLane = destinationLaneId === lanes[lanes.length - 1].id;

  if (isLastLane && destinationLaneId !== sourceLaneId) {
    return onItemReachedLastLane(sourceLaneId, itemId);
  }
};
