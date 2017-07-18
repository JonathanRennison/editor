import * as React from "react";
import { List } from "immutable";
import { Layer, Rect, Stage, Group, Text, Line } from "react-konva";
import { Stage as KonvaStage } from "konva";

import { Chapter } from "../../reducers/chapters";
import { ApplicationState } from "../../store";
import { countLeafNodes, getTreeHeight } from "../../util";

import { ChapterActions } from "../../actions/chapters";

import ChapterNode from "./chapter_node";
import NodeConnectors from "./node_connectors";

interface ProgramAuthorState {
  stage: KonvaStage | null;
}

class ProgramAuthor extends React.Component<ApplicationState & ChapterActions, ProgramAuthorState> {
  private stageWrapper: any;
  private baseBoxSize: [number, number] = [200, 120];
  private boxMargin: [number, number] = [40, 70];
  private canvasWidth = window.innerWidth - 50;

  constructor(props: ApplicationState & ChapterActions) {
    super(props);

    this.state = {
      stage: null
    };
  }

  private handleBoxClick(accessPath: Array<number>): void {
    alert("Move along, nothing to see here yet");
  }

  private handleRemoveClick(accessPath: Array<number>): void {
    if (accessPath.length === 1 && accessPath[0] === 0 && this.props.chapters.count() === 1) {
      alert("Root node cannot be removed");
      return;
    }

    this.props.removeChapter(accessPath);
  }

  private handleLabelClick(accessPath: Array<number>, currentName: string | undefined): void {
    const chapterName = prompt("Chapter name:", currentName || "");

    if (chapterName !== null && chapterName !== "") {
      this.props.renameChapter(accessPath, chapterName);
    }
  }

  private handleMasterLabelClick(accessPath: Array<number>): void {
    alert("Move along, nothing to see here");
  }

  private handleAddChapterClick(accessPath: Array<number>, handlePosition: "left" | "right" | "bottom"): void {
    if (handlePosition === "left") {
      this.props.addChapterBefore(accessPath);
    } else if (handlePosition === "right") {
      this.props.addChapterAfter(accessPath);
    } else {
      this.props.addChapterChild(accessPath);
    }
  }

  private drawChapterTree(chapters: List<Chapter>, startPos = [20, 20], accessPath: Array<number> = []): Array<any> {
    const { stage } = this.state;

    if (stage === null) {
      return [];
    }

    return chapters.reduce((result: Array<any>, chapter, i) => {
      const [x, y] = startPos;

      const leafNodes = countLeafNodes(chapter);
      const boxWidth = leafNodes * this.baseBoxSize[0] + (leafNodes - 1) * this.boxMargin[0];
      const currentPath = accessPath.concat(i);
      const hasChildren = chapter.has("children") && !(chapter.get("children")!).isEmpty();

      let rects = [
        <ChapterNode key={`group.${currentPath}`} stage={stage} chapter={chapter}
                     position={[x, y]} size={[boxWidth, this.baseBoxSize[1]]}
                     currentPath={currentPath}
                     boxClick={this.handleBoxClick.bind(this)}
                     nameLabelClick={this.handleLabelClick.bind(this)}
                     masterLabelClick={this.handleMasterLabelClick.bind(this)}
                     addChapterClick={this.handleAddChapterClick.bind(this)}
                     removeChapterClick={this.handleRemoveClick.bind(this)} />
      ].concat(
        this.drawChapterTree(
          chapter.get("children")!,
          [x, y + this.baseBoxSize[1] + this.boxMargin[1]],
          currentPath
        )
      ).concat(
        <NodeConnectors nodeCount={chapters.count()} currentIndex={i}
                        position={[x, y]} boxSize={[boxWidth, this.baseBoxSize[1]]}
                        margins={this.boxMargin} hasChildren={hasChildren}
                        key={`connectors.${currentPath}`} />
      );

      startPos[0] += boxWidth + this.boxMargin[0];

      return result.concat(rects);
    }, []);
  }

  private adjustBoxWidth() {
    const leafNodes = this.props.chapters.reduce((sum, chapter) => sum + countLeafNodes(chapter), 0);
    const treeWidth = this.baseBoxSize[0] * leafNodes + this.boxMargin[0] * (leafNodes + 1);

    if (treeWidth >= window.innerWidth) {
      this.baseBoxSize[0] = (window.innerWidth - 50 - this.boxMargin[0] * (leafNodes + 1)) / leafNodes;
    }
  }

  private adjustCanvasHeight(chapters: List<Chapter>) {
    const defaultCanvasHeight = this.baseBoxSize[1] * 2 + this.boxMargin[1] * 2;

    const treeHeight = getTreeHeight(chapters);
    const neededCanvasHeight = treeHeight * this.baseBoxSize[1] + treeHeight * this.boxMargin[1];

    if (neededCanvasHeight > defaultCanvasHeight) {
      return neededCanvasHeight;
    }

    return defaultCanvasHeight;
  }

  private getTreeOffset(chapters: List<Chapter>): [number, number] {
    const leafNodes = this.props.chapters.reduce((sum, chapter) => sum + countLeafNodes(chapter), 0);
    const treeWidth = this.baseBoxSize[0] * leafNodes + this.boxMargin[0] * (leafNodes + 1);

    const xOffset = this.canvasWidth / 2 - treeWidth / 2;

    return [xOffset + this.boxMargin[0], 10];
  }

  public componentDidMount() {
    this.setState({
      stage: this.stageWrapper.getStage()
    });
  }

  public render() {
    const { chapters } = this.props;

    const canvasHeight = this.adjustCanvasHeight(chapters) + this.boxMargin[1];
    this.adjustBoxWidth();
    const treeOffset = this.getTreeOffset(chapters);

    return (
      <div className="content">
        <h3>Author Program</h3>
        <Stage ref={(e: any) => this.stageWrapper = e} width={this.canvasWidth} height={canvasHeight}>
          <Layer>
            {this.drawChapterTree(chapters, treeOffset)}
            <Rect fill="#262626" strokeWidth={0}
                  x={0} y={0}
                  width={this.canvasWidth} height={treeOffset[1] - 1} />
          </Layer>
        </Stage>
      </div>
    );
  }
}

export default ProgramAuthor;