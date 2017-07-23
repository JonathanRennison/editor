import { List, Record } from "immutable";
import * as shortid from "shortid";
import { ActionHandler, findById, generateChapterKeyPath } from "../util";
import * as actions from "../actions/chapters";

type MasterId = string;

export interface ChapterAttributes {
  id: string;
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
  new Chapter({id: shortid.generate()})
]);

const actionHandler = new ActionHandler<ChapterState>(initialChapters);

actionHandler.addHandler("ADD_CHAPTER_BEFORE", (state, action: actions.ADD_CHAPTER_BEFORE) => {
  const { accessPath } = action.payload;

  const insertIndex = accessPath[accessPath.length - 1];
  let list: List<Chapter> = state;

  accessPath.slice(0, accessPath.length - 1).forEach((i) => {
    list = list.get(i)!.get("children")!;
  });

  const updatedChildren = list.insert(insertIndex, new Chapter({id: shortid.generate()}));
  const keyPath = generateChapterKeyPath(accessPath).pop();

  return state.updateIn(keyPath, () => updatedChildren);
});

actionHandler.addHandler("ADD_CHAPTER_AFTER", (state, action: actions.ADD_CHAPTER_AFTER) => {
  const { accessPath } = action.payload;

  const insertIndex = accessPath[accessPath.length - 1];
  let list: List<Chapter> = state;

  accessPath.slice(0, accessPath.length - 1).forEach((i) => {
    list = list.get(i)!.get("children")!;
  });

  const newChapter = new Chapter({id: shortid.generate()});
  const updatedChildren = (insertIndex >= list.count()) ? list.push(newChapter) : list.insert(insertIndex + 1, newChapter);
  const keyPath = generateChapterKeyPath(accessPath).pop();

  return state.updateIn(keyPath, () => updatedChildren);
});

actionHandler.addHandler("ADD_CHAPTER_CHILD", (state, action: actions.ADD_CHAPTER_CHILD) => {
  const { accessPath } = action.payload;
  const keyPath = generateChapterKeyPath(accessPath).push("children");

  const newChapter = new Chapter({
    id: shortid.generate(),
    children: state.getIn(keyPath)
  });

  return state.updateIn(keyPath, () => List([newChapter]));
});

actionHandler.addHandler("RENAME_CHAPTER", (state, action: actions.RENAME_CHAPTER) => {
  const { accessPath, name } = action.payload;
  const keyPath = generateChapterKeyPath(accessPath).push("name");

  return state.updateIn(keyPath, () => name);
});

actionHandler.addHandler("REMOVE_CHAPTER", (state, action: actions.REMOVE_CHAPTER) => {
  const { accessPath } = action.payload;
  const keyPath = generateChapterKeyPath(accessPath);

  return state.deleteIn(keyPath);
});

actionHandler.addHandler("ASSIGN_MASTER", (state, action: actions.ASSIGN_MASTER) => {
  const { accessPath, masterId } = action.payload;
  const keyPath = generateChapterKeyPath(accessPath).push("masterLayouts");

  return state.updateIn(keyPath, (masters) => masters.push(masterId));
});

export default actionHandler.getReducer();