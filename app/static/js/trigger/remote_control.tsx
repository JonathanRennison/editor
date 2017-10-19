import * as React from "react";
import { makeRequest } from "../editor/util";

interface RemoteControlProps {
  documentId: string;
}

interface PreviewStatus {
  active: boolean;
  status: string;
  playing?: boolean;
  position?: number;
}

interface RemoteControlState {
  previewStatus: PreviewStatus;
}

class RemoteControl extends React.Component<RemoteControlProps, RemoteControlState> {
  private statusInterval: any;

  public constructor(props: RemoteControlProps) {
    super(props);

    this.state = {
      previewStatus: {
        active: false,
        status: "Preview player is not running"
      }
    };
  }

  public componentDidMount() {
    this.statusInterval = setInterval(() => {
      makeRequest("GET", `/api/v1/document/${this.props.documentId}/remote`).then((data) => {
        const previewStatus = JSON.parse(data);
        console.log("Preview status:", previewStatus);

        this.setState({
          previewStatus
        });
      }).catch((err) => {
        console.error("Could not fetch preview status:", err);
      });
    }, 1000);
  }

  public componentWillUnmount() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  private sendControlCommand(command: any) {
    const { previewStatus } = this.state;
    const controlUrl = `/api/v1/document/${this.props.documentId}/remote/control`;

    if (previewStatus.active) {
      console.log("Sending playback command: ", command);

      makeRequest("POST", controlUrl, JSON.stringify(command), "application/json").then(() => {
        console.log("Playback state toggled");
      }).catch((err) => {
        console.warn("Could not toggle playback:", err);
      });
    } else {
      console.log("Preview not active, this is a no-op");
    }
  }

  public render() {
    const { previewStatus } = this.state;

    const style: React.CSSProperties = {
      position: "fixed",
      height: 60,
      bottom: 0,
      left: 0,
      width: "100%",
      padding: 10,
      borderTop: "2px solid #161616",
      display: "flex",
      justifyContent: "center"
    };

    return (
      <div style={style}>
        <button className="button is-info"
                style={{flexGrow: 0, margin: "0 5px"}}
                disabled={!previewStatus.active}
                onClick={this.sendControlCommand.bind(this, { adjust: -5.0 })}>
          -5s
        </button>
        <button className="button is-info"
                style={{flexGrow: 0, margin: "0 5px"}}
                disabled={!previewStatus.active}
                onClick={this.sendControlCommand.bind(this, { adjust: -0.04 })}>
          Rev
        </button>
        <button className="button is-info"
                style={{flexGrow: 0, margin: "0 5px"}}
                disabled={!previewStatus.active}
                onClick={this.sendControlCommand.bind(this, { playing: true })}>
          Play
        </button>
        <button className="button is-warning"
                style={{flexGrow: 0, margin: "0 5px"}}
                disabled={!previewStatus.active}
                onClick={this.sendControlCommand.bind(this, { playing: false })}>
          Pause
        </button>
        <button className="button is-info"
                style={{flexGrow: 0, margin: "0 5px"}}
                disabled={!previewStatus.active}
                onClick={this.sendControlCommand.bind(this, { adjust: 0.04 })}>
          Fwd
        </button>
      </div>
    );
  }
}

export default RemoteControl;