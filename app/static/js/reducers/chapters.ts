import { List } from "immutable";
import { ActionHandler, findById} from "../util";
import { ADD_CHAPTER_BEFORE, ADD_CHAPTER_AFTER, ADD_CHAPTER_CHILD } from "../actions";

const testChapters: List<Chapter> = List([
  {id: "a", masterLayouts: List([]), children: List([
    {id: "aaa", masterLayouts: List([]), children: List([
      {id: "aaaa", masterLayouts: List([]), children: List([
      {id: "aaab", masterLayouts: List([]), children: List([
        {id: "aaaba", masterLayouts: List([]), children: List([])},
        {id: "aaaba", masterLayouts: List([]), children: List([])}
      ])}
      ])}
    ])},
    {id: "aab", masterLayouts: List([]), children: List([])}
  ])},
  {id: "b", masterLayouts: List([]), children: List([
    {id: "ba", masterLayouts: List([]), children: List([
      {id: "baa", masterLayouts: List([]), children: List([])},
      {id: "bab", masterLayouts: List([]), children: List([])}
    ])},
    {id: "bb", masterLayouts: List([]), children: List([])},
  ])},
  {id: "c", masterLayouts: List([]), children: List([
    {id: "ca", masterLayouts: List([]), children: List([
      {id: "caa", masterLayouts: List([]), children: List([
        {id: "caaa", masterLayouts: List([]), children: List([
          {id: "caaaa", masterLayouts: List([]), children: List([
            {id: "caaaaa", masterLayouts: List([]), children: List([])}
          ])}
        ])}
      ])}
    ])}
  ])}
]);


type MasterId = string;

export interface Chapter {
  id: string;
  name?: string;
  masterLayouts: List<MasterId>;
  children: List<Chapter>;
}

export type ChapterState = List<Chapter>;

const actionHandler = new ActionHandler<ChapterState>(testChapters);

export default actionHandler.getReducer();