/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

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
  
  // return (
  //   <Box sx={{ flexGrow: 1 }}>
  //     <Grid container spacing={2}>
  //       <Grid item xs={8}>
  //         <Item>xs=8</Item>
  //       </Grid>
  //       <Grid item xs={4}>
  //         <Item>xs=4</Item>
  //       </Grid>
  //       <Grid item xs={4}>
  //         <Item>xs=4</Item>
  //       </Grid>
  //       <Grid item xs={8}>
  //         <Item>xs=8</Item>
  //       </Grid>
  //     </Grid>
  //   </Box>
  // );
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

