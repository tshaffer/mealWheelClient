import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  uploadFile,
} from '../controllers';

export interface ToolsAndSettingsProps {
  onUploadFile: (formData: FormData) => any;
}

const ToolsAndSettings = (props: ToolsAndSettingsProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    const data = new FormData();
    data.append('file', selectedFile);
    props.onUploadFile(data);
  };

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
