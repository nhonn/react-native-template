import { InteractionManager } from "react-native";

export const runAfterInteractions = (callback: () => void) => {
  InteractionManager.runAfterInteractions(callback);
};

export const setDeadlines = (deadline: number, callback?: () => void) => {
  (InteractionManager.setDeadline as any)(deadline, callback);
};

export const createInteractionHandle = () => {
  return InteractionManager.createInteractionHandle();
};

export const clearInteractionHandle = (handle: number) => {
  InteractionManager.clearInteractionHandle(handle);
};

export { InteractionManager };
