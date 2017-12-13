import { ActionCreatorsMapObject } from "redux";
import { PayloadAction } from "../util";

export type ADD_TIMELINE = PayloadAction<"ADD_TIMELINE", {chapterId: string}>;
function addTimeline(chapterId: string): ADD_TIMELINE {
  return {
    type: "ADD_TIMELINE",
    payload: {
      chapterId
    }
  };
}

export type ADD_TIMELINE_TRACK = PayloadAction<"ADD_TIMELINE_TRACK", {chapterId: string, regionId: string}>;
function addTimelineTrack(chapterId: string, regionId: string): ADD_TIMELINE_TRACK {
  return {
    type: "ADD_TIMELINE_TRACK",
    payload: {
      chapterId,
      regionId
    }
  };
}

export type ADD_ELEMENT_TO_TIMELINE_TRACK = PayloadAction<"ADD_ELEMENT_TO_TIMELINE_TRACK", {chapterId: string, trackId: string, componentId: string}>;
function addElementToTimelineTrack(chapterId: string, trackId: string, componentId: string): ADD_ELEMENT_TO_TIMELINE_TRACK {
  return {
    type: "ADD_ELEMENT_TO_TIMELINE_TRACK",
    payload: {
      chapterId, trackId, componentId
    }
  };
}

export interface TimelineActions extends ActionCreatorsMapObject {
  addTimeline: (chapterId: string) => ADD_TIMELINE;
  addTimelineTrack: (chapterId: string, regionId: string) => ADD_TIMELINE_TRACK;
  addElementToTimelineTrack: (chapterId: string, trackId: string, componentId: string) => ADD_ELEMENT_TO_TIMELINE_TRACK;
}

export const actionCreators: TimelineActions = {
  addTimeline,
  addTimelineTrack,
  addElementToTimelineTrack
};
