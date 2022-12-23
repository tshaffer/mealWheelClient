import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  uploadFile,
} from '../controllers';
import { isNil } from 'lodash';
import { Alert } from '@mui/material';

export interface ToolsAndSettingsProps {
  onUploadFile: (formData: FormData) => any;
}

const ToolsAndSettings = (props: ToolsAndSettingsProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);

  const [failBlog, setFailBlog] = React.useState(false);
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
          setFailBlog(true);
        });
    }
  };

  if (failBlog) {
    return (
      <Alert
        severity="error"
        onClose={() => {setFailBlog(false);}}
      >
        This is a error alert <strong>check it out!</strong>
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
}

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUploadFile: uploadFile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolsAndSettings);
