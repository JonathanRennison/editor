import * as React from "react";
import { Stage } from "react-konva";
import { Stage as KonvaStage } from "konva";

import { Screen as ScreenModel, ScreenRegion } from "../../reducers/screens";
import Screen from "../screen";
import ContextMenu, { ContextMenuEntry, ContextMenuDivider } from "../context_menu";

export interface SplittableScreenProps {
  screenInfo: ScreenModel;
  width: number;
  removeDevice: () => void;
  splitRegion: (id: string, orientation: "horizontal" | "vertical", position: number) => void;
  undoLastSplit: () => void;
}

interface SplittableScreenState {
  contextMenu: {
    visible: boolean,
    x: number,
    y: number,
  };
}

class SplittableScreen extends React.Component<SplittableScreenProps, SplittableScreenState> {
  private stageWrapper: Stage | null;

  constructor(props: SplittableScreenProps) {
    super(props);

    this.state = {
      contextMenu: {
        visible: false, x: 0, y: 0
      }
    };
  }

  private getClickedRegion(x: number, y: number): ScreenRegion | undefined {
    const regions = this.props.screenInfo.regions;

    const clickedRegion = regions.findEntry((region) => {
      const topLeft = region.position;
      const bottomRight = [topLeft[0] + region.size[0], topLeft[1] + region.size[1]];

      return x >= topLeft[0] && x < bottomRight[0] && y >= topLeft[1] && y < bottomRight[1];
    });

    if (clickedRegion) {
      return clickedRegion[1];
    }
  }

  private getCanvasClickPosition(pageX: number, pageY: number) {
    if (!this.stageWrapper) {
      throw new Error("Stage ref is null");
    }

    const stage: KonvaStage = this.stageWrapper.getStage();
    const {offsetLeft, offsetTop} = stage.container();

    return [
      pageX - offsetLeft,
      pageY - offsetTop
    ];
  }

  private splitRegion(orientation: "horizontal" | "vertical") {
    if (!this.stageWrapper) {
      throw new Error("Stage ref is null");
    }

    const stage: KonvaStage = this.stageWrapper.getStage();

    const {x: pageX, y: pageY} = this.state.contextMenu;
    const [x, y] = this.getCanvasClickPosition(pageX, pageY);
    const clickedRegion = this.getClickedRegion(x / stage.width(), y / stage.height());

    if (clickedRegion) {
      const splitPosition = (orientation === "horizontal") ? y / stage.height() : x / stage.width();
      this.props.splitRegion(clickedRegion.id, orientation, splitPosition);
    }
  }

  private handleCanvasClick(ev: MouseEvent) {
    this.setState({
      contextMenu: {
        visible: true,
        x: ev.pageX,
        y: ev.pageY
      }
    });
  }

  public render() {
    const { width, screenInfo } = this.props;
    const { contextMenu } = this.state;

    const onContextMenuClick = () => {
      this.setState({contextMenu: {visible: false, x: 0, y: 0}});
    };

    return (
      <div>
        <ContextMenu {...contextMenu} onItemClicked={onContextMenuClick}>
          <ContextMenuEntry name="Split horizontal" callback={this.splitRegion.bind(this, "horizontal")} />
          <ContextMenuEntry name="Split vertical" callback={this.splitRegion.bind(this, "vertical")} />
          <ContextMenuDivider />
          <ContextMenuEntry name="Undo last split" callback={this.props.undoLastSplit.bind(this)} />
          <ContextMenuDivider />
          <ContextMenuEntry name="Cancel" callback={() => {}} />
        </ContextMenu>
        <p>
          Name: {screenInfo.name}<br/>
          Orientation: {screenInfo.orientation}<br/>
          <span style={{cursor: "pointer", color: "#FF0000"}} onClick={this.props.removeDevice}>
            remove
          </span>
        </p>
        <div>
          <div style={{display: "table", margin: "0 auto"}} onClickCapture={this.handleCanvasClick.bind(this)}>
            <Screen width={width} screenInfo={screenInfo} assignStageRef={(e) => this.stageWrapper = e } />
          </div>
        </div>
        <br/>
      </div>
    );
  }
}

export default SplittableScreen;
