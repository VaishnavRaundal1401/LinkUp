import React, {createContext, useState, useRef, useEffect} from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

//react functional component
const ContextProvider = ({ children }) => {

    const [stream, setStream] = useState(null);
    //as our page loads we want to take permission for audio and video
    const [me, setMe] = useState('');
    const [call, setCall] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
      }, [myVideo, stream]);


    useEffect(() => {
        navigator.mediaDevices.getUserMedia({video:true, audio:true})
            .then((currentStream) => {
                setStream(currentStream);
                    if (myVideo.current) {
                        myVideo.current.srcObject = stream;
                    }
            });
            socket.on('me', (id) => setMe(id));

            socket.on('calluser', ({from, name: callerName, signal}) => {
                setCall({isReceivedCall:true, from, name:callerName, signal});
            })
    },[]);
    
    const answercall = () =>{
        setCallAccepted(true);

        const peer = new Peer({initiator:false, trickle:false, stream});

        peer.on('signal',(data) => {
            socket.emit('answercall', {signal: data, to: call.from});
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer; //that means our current connection is equal to the current peer who is inside this connection.
    }

    const callUser = (id) =>{

        const peer = new Peer({initiator:true, trickle:false, stream});

        peer.on('signal',(data) => {
            socket.emit('calluser', {userToCall: id, signalData: data, from: me, name});
        });

        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', (signal) =>{
            setCallAccepted(true);

            peer.signal(signal);
        });

        connectionRef.current = peer;
    }

    const leaveCall = () =>{
        setCallEnded(true);
        connectionRef.current.destroy();//destroy that specific connection
        window.location.reload();
    }

    return (
        <SocketContext.Provider value={{
            call,
            callAccepted,
            myVideo,
            userVideo,
            stream, 
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            answercall,
        }}>
            {children}

        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext};