// hooks
import { useCallback, useState, useMemo, useEffect } from 'react';
import useSound from 'use-sound';
import useAsyncState from '../hooks/useAsyncState';
import { useSnackbar } from 'notistack';

// utils
import {
  createInitialBoardState,
  addItemToBoardLane,
  moveBoardItem,
  updateBoardLaneForm,
  deleteItemFromBoardLane,
} from '../utils/board';

// sfx
import crowdCheerSfx from '../assets/sounds/crowd-cheer.mp3';
import crumplingPaperSfx from '../assets/sounds/crumpling-paper.mp3';

export default function useBoard(lanes) {
  const [boardState, setBoardState] = useState(createInitialBoardState(lanes));
  const [isDragging, setIsDragging] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [itemReachedLastLane, setItemReachedLastLane] = useAsyncState(false);
  const [playCrowdCheer] = useSound(crowdCheerSfx, {
    interrupt: true,
    volume: 0.5,
    playbackRate: 1.1,
  });
  const [playCrumplingPaper] = useSound(crumplingPaperSfx, {
    interrupt: true,
    volume: 0.5,
    playbackRate: 0.8,
  });

  // if items change, save to local storage
  useEffect(() => {
    boardState.lanes.forEach((lane) => {
      localStorage.setItem(lane.id, JSON.stringify(lane.items));
    });
  }, [boardState.lanes]);

  const onItemReachedLastLane = useCallback(async () => {
    // doing this so that the confetti re-triggers
    await setItemReachedLastLane(false);
    await setItemReachedLastLane(true);
    closeSnackbar();
    enqueueSnackbar('You did it! 🎉', { variant: 'success' });
    playCrowdCheer();
  }, [playCrowdCheer, setItemReachedLastLane, enqueueSnackbar, closeSnackbar]);

  const handleOnDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleOnDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
         setIsDragging(false);
         return;
      };

      const updatedLanes = moveBoardItem(
        boardState.lanes,
        result.source,
        result.destination,
        onItemReachedLastLane
      );

      setBoardState((prevState) => ({
        ...prevState,
        lanes: updatedLanes,
      }));

      setIsDragging(false);
    },
    [boardState, onItemReachedLastLane]
  );

  const handleBoardNewItemFormChange = useCallback((laneId, content) => {
    setBoardState((prevState) => ({
      ...prevState,
      lanes: updateBoardLaneForm(prevState.lanes, laneId, content),
    }));
  }, []);

  const addItem = useCallback(
    (laneId, itemContent) => {
      if (!itemContent) return;

      setBoardState((prevState) => ({
        ...prevState,
        lanes: addItemToBoardLane(prevState.lanes, laneId),
      }));

      // if for some reason people will add an item to the "Done" lane, we'll trigger the confetti again
      if (laneId === boardState.lanes[boardState.lanes.length - 1].id) {
        onItemReachedLastLane();
      }
      handleBoardNewItemFormChange(laneId, '');
    },
    [
      handleBoardNewItemFormChange,
      onItemReachedLastLane,
      setBoardState,
      boardState.lanes,
    ]
  );

  const deleteItem = useCallback(
    (laneId, itemId) => {
      setBoardState((prevState) => ({
        ...prevState,
        lanes: deleteItemFromBoardLane(prevState.lanes, laneId, itemId),
      }));
      playCrumplingPaper();
    },
    [playCrumplingPaper, setBoardState]
  );

  const boardLanes = useMemo(() => [...boardState.lanes], [boardState.lanes]);

  return {
    boardLanes,
    isDragging,
    itemReachedLastLane,
    handleOnDragStart,
    handleOnDragEnd,
    handleBoardNewItemFormChange,
    addItem,
    deleteItem,
  };
}
