import * as React from "react";
import * as classNames from "classnames";

import { makeRequest } from "../../editor/util";
import { FileInputField } from "./input_fields";

interface FileInputFormProps {
  onSubmit: () => void;
}

interface FileInputFormState {
  fileData: string;
  submitSuccess?: boolean;
}

class FileInputForm extends React.Component<FileInputFormProps, FileInputFormState> {
  public constructor(props: FileInputFormProps) {
    super(props);

    this.state = {
      fileData: ""
    };
  }

  private submitFileForm() {
    makeRequest("PUT", "/api/v1/configuration", this.state.fileData, "application/json").then(() => {
      this.setState({
        submitSuccess: true,
        fileData: ""
      });

      this.props.onSubmit();
    }).catch(() => {
      this.setState({
        submitSuccess: false,
        fileData: ""
      });
    });
  }

  private renderNotification() {
    if (this.state.submitSuccess === undefined) {
      return;
    }

    const notificationColor = (this.state.submitSuccess) ? "is-success" : "is-danger";

    setTimeout(() => {
      this.setState({submitSuccess: undefined});
    }, 5000);

    return (
      <div>
        <br/>
        <div className={classNames(["notification", notificationColor])} style={{padding: 10}}>
          <button className="delete" onClick={() => this.setState({submitSuccess: undefined})}></button>
          {(this.state.submitSuccess)
            ? "Data successfully updated!"
            : "Could not update data!"}
        </div>
      </div>
    );
  }

  public render() {
    return (
      <div>
        <h4>Upload JSON Config File</h4>
        {this.renderNotification()}
        <br/>
        <FileInputField label="Config File" clear={this.state.fileData === ""} onChange={(data) => this.setState({ fileData: data })} />
        <br/>

        <div className="field is-horizontal">
          <div className="field-label"></div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <button className="button is-info" onClick={this.submitFileForm.bind(this)} disabled={this.state.fileData === ""}>
                  Upload Config
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FileInputForm;