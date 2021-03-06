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

import { ActionCreatorsMapObject } from "redux";
import { PayloadAction } from "../util";

export type ADD_ASSET = PayloadAction<"ADD_ASSET", {id: string, name: string, description: string, previewUrl: string, duration?: number}>;
/**
 * Creates an action for adding a new asset.
 *
 * @param id ID of the asset to add
 * @param name Name of the asset
 * @param description Description of the asset
 * @param previewUrl URL pointing to a preview image
 * @param duration Duration of the asset. Optional
 */
function addAsset(id: string, name: string, description: string, previewUrl: string, duration?: number): ADD_ASSET {
  return {
    type: "ADD_ASSET",
    payload: {
      id, name, description, previewUrl, duration
    }
  };
}

export interface AssetActions extends ActionCreatorsMapObject {
  addAsset: (id: string, name: string, description: string, previewUrl: string, duration?: number) => ADD_ASSET;
}

export const actionCreators: AssetActions = {
  addAsset
};
