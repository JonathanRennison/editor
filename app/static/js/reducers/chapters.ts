import { List, Record } from "immutable";
import * as shortid from "shortid";
import { ActionHandler, findById } from "../util";
import { ADD_CHAPTER_BEFORE, ADD_CHAPTER_AFTER, ADD_CHAPTER_CHILD, RENAME_CHAPTER } from "../actions";

type MasterId = string;

export interface ChapterAttributes {
  id?: string;
  name?: string | null;
  masterLayouts?: List<MasterId>;
  children?: List<Chapter>;
}

export class Chapter extends Record<ChapterAttributes>({id: "", name: null, masterLayouts: List(), children: List()}) {
  constructor(params?: ChapterAttributes) {
    params ? super(params) : super();
  }
}

export type ChapterState = List<Chapter>;

const initialChapters: List<Chapter> = List([
  new Chapter({id: shortid.generate(), masterLayouts: List<MasterId>([]), children: List<Chapter>([])})
]);

const actionHandler = new ActionHandler<ChapterState>(initialChapters);

actionHandler.addHandler("ADD_CHAPTER_BEFORE", (state, action: ADD_CHAPTER_BEFORE) => {
  const { accessPath } = action.payload;

  const insertIndex = accessPath[accessPath.length - 1];
  let list: List<Chapter> = state;

  accessPath.slice(0, accessPath.length - 1).forEach((i) => {
    list = list.get(i)!.get("children")!;
  });

  const updatedChildren = list.insert(insertIndex, new Chapter({
    id: shortid.generate(),
    masterLayouts: List(),
    children: List()
  }));

  const keyPath = List(accessPath.slice(0, accessPath.length - 1).reduce((path: Array<string | number>, i) => {
    return path.concat([i, "children"]);
  }, []));

  return state.updateIn(keyPath, () => updatedChildren);
});

actionHandler.addHandler("ADD_CHAPTER_AFTER", (state, action: ADD_CHAPTER_AFTER) => {
  const { accessPath } = action.payload;

  const insertIndex = accessPath[accessPath.length - 1];
  let list: List<Chapter> = state;

  accessPath.slice(0, accessPath.length - 1).forEach((i) => {
    list = list.get(i)!.get("children")!;
  });

  const newChapter = new Chapter({
    id: shortid.generate(),
    masterLayouts: List(),
    children: List()
  });
  const updatedChildren = (insertIndex >= list.count()) ? list.push(newChapter) : list.insert(insertIndex + 1, newChapter);

  const keyPath = List(accessPath.slice(0, accessPath.length - 1).reduce((path: Array<string | number>, i) => {
    return path.concat([i, "children"]);
  }, []));

  return state.updateIn(keyPath, () => updatedChildren);
});

actionHandler.addHandler("ADD_CHAPTER_CHILD", (state, action: ADD_CHAPTER_CHILD) => {
  const { accessPath } = action.payload;

  const keyPath = List(accessPath.slice(0, accessPath.length).reduce((path: Array<string | number>, i) => {
    return path.concat([i, "children"]);
  }, []));

  const newChapter = Map({
    id: shortid.generate(),
    masterLayouts: List(),
    children: state.getIn(keyPath)
  });

  return state.updateIn(keyPath, () => List([newChapter]));
});

actionHandler.addHandler("RENAME_CHAPTER", (state, action: RENAME_CHAPTER) => {
  const { accessPath, name } = action.payload;

  const keyPath = List(accessPath.slice(0, accessPath.length - 1).reduce((path: Array<string | number>, i) => {
    return path.concat([i, "children"]);
  }, [])).push(accessPath[accessPath.length - 1], "name");

  return state.updateIn(keyPath, () => name);
});

export default actionHandler.getReducer();
