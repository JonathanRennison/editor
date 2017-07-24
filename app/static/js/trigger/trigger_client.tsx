import * as React from "react";
import { makeRequest } from "../editor/util";

interface TriggerClientProps {
  documentId: string;
}

export interface EventParams {
  name: string;
  parameter: string;
  type: string;
}

export interface Event {
  trigger: boolean;
  modify: boolean;
  id: string;
  parameters: Array<EventParams>;
  name: string;
}

interface TriggerClientState {
  abstractEvents: Array<Event>;
  instantiatedEvents: Array<any>;
}

class TriggerClient extends React.Component<TriggerClientProps, TriggerClientState> {
  constructor(props: TriggerClientProps) {
    super(props);

    this.state = {
      abstractEvents: [],
      instantiatedEvents: []
    };
  }

  public componentDidMount() {
    const url = `/api/v1/document/${this.props.documentId}/events`;

    makeRequest("GET", url).then((data) => {
      this.setState({
        abstractEvents: JSON.parse(data)
      });
    }).catch((err) => {
      console.error("Could not fetch triggers:", err);
    });
  }

  public render() {
    return (
      <div style={{color: "#FFFFFF"}}>
        {this.state.abstractEvents.map((event: Event, i) => {
          return (
            <p>{event.id} => {event.name}</p>
          );
        })}
      </div>
    );
  }
}

export default TriggerClient;