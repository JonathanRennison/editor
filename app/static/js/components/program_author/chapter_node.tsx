import * as React from "react";
import { List } from "immutable";
import { Stage, Group, Rect, Text } from "react-konva";
import { Stage as KonvaStage } from "konva";

import { Coords } from "../../util";
import { Chapter } from "../../reducers/chapters";

interface ChapterBoxProps {
  stage: KonvaStage;
  chapter: Chapter;
  position: Coords;
  size: Coords;
  currentPath: Array<number>;

  boxClick: (currentPath: Array<number>, position: Coords, size: Coords) => void;
  nameLabelClick: (currentPath: Array<number>, currentName: string) => void;
  masterLabelClick: (currentPath: Array<number>) => void;
}

class ChapterBox extends React.Component<ChapterBoxProps, {}> {
  public render() {
    const {chapter, stage, position, size, currentPath} = this.props;

    const [x, y] = position;
    const [boxWidth, boxHeight] = size;

    const masterLayouts = chapter.get("masterLayouts")! as List<string>;
    const masterLabel = masterLayouts.isEmpty() ? "(no masters assigned)" : masterLayouts.join(", ");

    return (
      <Group>
        <Rect key={chapter.get("id") as string}
              fill="#FFFFFF" stroke="#000000"
              x={x} y={y}
              onMouseEnter={() => stage.container().style.cursor = "pointer"}
              onMouseLeave={() => stage.container().style.cursor = "default"}
              onClick={this.props.boxClick.bind(this, currentPath, [x, y], [boxWidth, boxHeight])}
              height={boxHeight} width={boxWidth} />
        <Text text={chapter.get("name", "(to be named)") as string} align="center"
              x={x} y={y + boxHeight + 5}
              width={boxWidth}
              onMouseEnter={() => stage.container().style.cursor = "pointer"}
              onMouseLeave={() => stage.container().style.cursor = "default"}
              onClick={this.props.nameLabelClick.bind(this, currentPath, chapter.get("name"))}
              fill="#FFFFFF" fontStyle="bold" fontSize={12}
              key={`label.${chapter.get("id")}`} />
        <Text text={masterLabel} align="center"
              x={x} y={y + boxHeight + 24}
              width={boxWidth}
              onMouseEnter={() => stage.container().style.cursor = "pointer" }
              onMouseLeave={() => stage.container().style.cursor = "default" }
              onClick={this.props.masterLabelClick.bind(this, currentPath)}
              fill="#FFFFFF" fontSize={12} fontStyle="italic"
              key={`masters.${chapter.get("id")}`} />
      </Group>
    );
  }
}

export default ChapterBox;