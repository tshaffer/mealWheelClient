import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  uploadFile,
} from '../controllers';
import { isNil } from 'lodash';
import { Alert } from '@mui/material';
import { MealWheelDispatch } from '../models';

export interface ToolsAndSettingsProps {
  onUploadFile: (formData: FormData) => any;
}

const ToolsAndSettings = (props: ToolsAndSettingsProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);

  const [uploadError, setUploadError] = React.useState(false);
  const [errorList, setErrorList] = React.useState<string[]>([]);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    if (!isNil(selectedFile)) {
      const data = new FormData();
      data.append('file', selectedFile);
      props.onUploadFile(data)
        .then((response: any) => {
          console.log(response);
          console.log(response.statusText);
        }).catch((err: any) => {
          console.log('uploadFile returned error');
          console.log(err);
          // const errorList: string[] = err.response.data;
          // console.log('errorList:');
          // console.log(errorList);
          setErrorList(err.response.data);
          setUploadError(true);
        });
    }
  };

  const renderErrors = () => {
    const errors: any[] = errorList.map((errorItem: any, index: number) => {
      return (
        <React.Fragment key={index}>
          {errorItem}
          <br />
        </React.Fragment>
      );
    });
    return errors;
  };

  if (uploadError) {
    const renderedErrors = renderErrors();
    return (
      <Alert
        severity="error"
        onClose={() => { setUploadError(false); }}
      >
        <div>
          Errors encountered while parsing spec<br />
          {renderedErrors}
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <input type="file" name="file" onChange={handleFileChangeHandler} />
      <br />
      <button type="button" onClick={handleUploadFile}>Upload</button>
      <br />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: MealWheelDispatch) => {
  return bindActionCreators({
    onUploadFile: uploadFile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsAndSettings);
