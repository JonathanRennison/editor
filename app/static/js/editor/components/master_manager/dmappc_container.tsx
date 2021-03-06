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

import * as React from "react";
import { List } from "immutable";
import { Asset } from "../../api_types";

/**
 * Props for DMAppcContainer
 */
interface DMAppcContainerProps {
  baseUrl: string;
  assets: List<Asset>;
}

/**
 * This component renders a container at half the height of the screen and a
 * container for each asset passed in through the `assets` prop. This container
 * renders a preview image for each asset, its title and a short description.
 * Each of these asset containers has its `draggable` property set to true, i.e.
 * the container can be dragged onto other elements and data can be transferred
 * this way. In this instance, the element the asset container has been dropped
 * over receives the asset's ID.
 *
 * @param baseUrl Base URL for `previewUrl` in assets
 * @param assets List of assets to be rendered inside this container
 */
const DMAppcContainer: React.SFC<DMAppcContainerProps> = (props) => {
  const { assets, baseUrl } = props;

  // Set dataTransfer property in drag event object to current asset ID
  const setDragData = (assetId: string, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", assetId);
  };

  // Render all assets as a list with name, description and preview image
  return (
    <div style={{height: "50%", overflowY: "scroll", backgroundColor: "#353535", borderTop: "1px solid #161616", padding: 2}}>
      {assets.map((asset, i: number) => {
        const previewUrl = baseUrl + asset.previewUrl;

        // Set draggable to true and assign asset ID on drag start
        return (
          <div
            key={i}
            draggable={true}
            onDragStart={setDragData.bind(null, asset.id)}
            style={{backgroundColor: "#262626", margin: 3, height: 100, padding: 10, display: "flex"}}
          >
            <div style={{height: 80, width: 80}}>
              <img src={previewUrl} style={{ width: 80, maxHeight: 80 }} />
            </div>
            <div style={{marginLeft: 15}}>
              <b style={{fontSize: 15}}>{asset.name}</b>
              <p style={{marginTop: 10, fontSize: 12}}>{asset.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DMAppcContainer;
