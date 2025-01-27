import React, { useContext } from 'react';
import { Typography, Grid, Paper } from '@material-ui/core';
import { makeStyles} from '@material-ui/core/styles';
import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const VideoPlayer = () => {

  const {name, callAccepted, myVideo, userVideo, callEnded, stream, call} = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {/* our own video */}
      {stream && (
          <Paper className={classes.paper}>
            <Grid item xs={12} md={6}>
              <Typography varient = 'h5' gutterBottom>{name || 'Name'}</Typography>
              <video playsInline ref={myVideo} autoPlay className={classes.video}/>
            </Grid>
          </Paper>
        )}
      {/* User's Video */}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography varient = 'h5' gutterBottom>{call.name || 'Name'}</Typography>
            <video playsInline ref={userVideo} autoPlay className={classes.video}/>
          </Grid>
        </Paper>
      )}
    </Grid>
  )
}

export default VideoPlayer


