import React, { useContext } from 'react'
import { Button } from '@material-ui/core';
import { SocketContext } from '../SocketContext';

const Notifications = () => {
  const {answercall, call, callAccepted} = useContext(SocketContext);
  if (!call) return null;
  return (
    <>
      {call.isReceivedCall && !callAccepted && (// if we have a receiving call and the call is not yet accepted
        <div style={{display:'flex', justifyContent:'center'}}>
            <h1>{call.name} is Calling: </h1>
            <Button variant='contained' color='primary' onClick={answercall}>
                Answer
            </Button>
        </div>
      )}
    </>
  )
}


export default Notifications
