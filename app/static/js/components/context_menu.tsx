import * as React from "react";

interface ContextMenuEntryProps {
  name: string;
  callback: () => void;
}

interface ContextMenuEntryState {
  selected: boolean;
}

export class ContextMenuEntry extends React.Component<ContextMenuEntryProps, ContextMenuEntryState> {
  constructor(props: ContextMenuEntryProps) {
    super(props);

    this.state = {
      selected: false
    };
  }

  public render() {
    const { name, callback } = this.props;
    const { selected } = this.state;

    const style: React.CSSProperties = {
      padding: "2px 40px 2px 20px",
      cursor: "pointer",
      backgroundColor: selected ? "#007ACC" : "transparent",
      color: selected ? "#FFFFFF" : "#000000",
      fontSize: "11pt"
    };

    return (
      <div onMouseOver={() => this.setState({selected: true})}
           onMouseOut={() => this.setState({selected: false})}
           onClick={callback}
           style={style}>
        {name}
      </div>
    );
  }
}

interface ContextMenuProps {
  x: number;
  y: number;
  visible: boolean;
  children: JSX.Element | Array<JSX.Element>;

  onItemClicked?: () => void;
}

class ContextMenu extends React.Component<ContextMenuProps, {}> {
  public static defaultProps = {
    onItemClicked: () => {}
  };

  public render() {
    const {x, y, visible, children} = this.props;

    const style: React.CSSProperties = {
      position: "absolute",
      left: x,
      top: y,
      backgroundColor: "#FFFFFF",
      borderRadius: 4
    };

    if (visible) {
      return (
        <div onClickCapture={() => this.props.onItemClicked!()}
             style={style}>
          <div style={{width: "100%", height: 4}}></div>
          {children}
          <div style={{width: "100%", height: 4}}></div>
        </div>
      );
    }

    return null;
  }
}

export default ContextMenu;