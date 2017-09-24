import * as React from "react";

import { makeRequest } from "../../editor/util";
import CurrentVersion from "../../editor/components/current_version";
import ManualInputForm, { FormValues } from "./manual_input_form";
import FileInputForm from "./file_input_form";

interface ConfigState {
  formData: Partial<FormValues>;
}

class Config extends React.Component<{}, ConfigState> {
  public constructor(props: ConfigState) {
    super(props);

    this.state = {
      formData: {}
    };
  }

  public fetchConfigData() {
    makeRequest("GET", "/api/v1/configuration").then((data) => {
      const config = JSON.parse(data);
      this.setState({ formData: config});
    }).catch((error) => {
      console.error("Could not retrieve configuration:", error);
    });
  }

  public componentDidMount() {
    this.fetchConfigData();
  }

  public render() {
    const boxStyle: React.CSSProperties = {
      width: "70vw",
      margin: "40px auto 40px auto",
      backgroundColor: "#EFEFEF",
      padding: 25,
      borderRadius: 15,
    };

    return (
      <div style={boxStyle}>
        <h3 style={{fontSize: 25, color: "#555555"}}>Configuration</h3>
        <br/>
        <FileInputForm onSubmit={this.fetchConfigData.bind(this)} />
        <br/>
        <ManualInputForm formData={this.state.formData} onSubmit={this.fetchConfigData.bind(this)} />

        <CurrentVersion />
      </div>
    );
  }
}

export default Config;
