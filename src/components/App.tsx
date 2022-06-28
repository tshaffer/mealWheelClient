/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Box } from '@mui/material';
import { generateMenu, initializeApp, uploadFile } from '../controllers';

export interface AppProps {
  onInitializeApp: () => any;
  onGenerateMenu: () => any;
  onUploadFile: (formData: FormData) => any;
}

const App = (props: AppProps) => {

  React.useEffect(() => {
    props.onInitializeApp();
  }, []);

  const [selectedFile, setSelectedFile] = React.useState(null);

  const handleFileChangeHandler = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleGenerateMenu = () => {
    console.log('generateMenu');
    props.onGenerateMenu();
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
        <button type="button" onClick={handleGenerateMenu}>Generate Menu</button>
        <br />
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
    onInitializeApp: initializeApp,
    onUploadFile: uploadFile,
    onGenerateMenu: generateMenu,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

