/**
 * Copyright 2018 Centrum Wiskunde & Informatica
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import assets from "./assets";
import chapters from "./chapters";
import document from "./document";
import masters from "./masters";
import screens from "./screens";
import timelines from "./timelines";

// Combine all reducers into a single reducer
const rootReducer = combineReducers({
  assets,
  chapters,
  document,
  masters,
  router: routerReducer,
  screens,
  timelines
});

export default rootReducer;
