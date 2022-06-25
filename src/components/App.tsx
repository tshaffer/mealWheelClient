/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import { uploadFile } from '../controllers/appState';

export interface AppProps {
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadFile = () => {
    console.log('uploadFile: ', selectedFile);
    const data = new FormData();
    data.append('file', selectedFile);
    props.onUploadFile(data);
  };

  return (
    <div>
      <Box
        component='form'
        sx={{
          '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete='off'
      >
        <input type="file" name="file" onChange={handleFileChangeHandler} />
        <br />
        <button type="button" onClick={handleUploadFile}>Upload</button>
        <br />
      </Box>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onUploadFile: uploadFile,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

