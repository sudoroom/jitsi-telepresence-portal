/* eslint-disable no-undef */
import { JitsiMeeting } from '@jitsi/web-sdk';
import React, { useRef, useState } from 'react';

const monitorServerUrl = '/ducks';
const turnMonitorOnUrl = `${monitorServerUrl}/on`;
const turnMonitorOffUrl = `${monitorServerUrl}/off`;

const App = () => {
    const apiRef = useRef();
    const apiRefNew = useRef();

    const printEventOutput = payload => {
        console.log(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleParticipantChanged = (payload, api) => {
        const pInfo = api.getParticipantsInfo();
        const url = pInfo.length > 1 ? turnMonitorOnUrl : turnMonitorOffUrl;

        fetch(url)
            .then(response => response.json())
            .then(data => console.log(data));

        console.log(pInfo);
    };

    const handleJitsiIFrameRef = iframeRef => {
        iframeRef.style.marginTop = '10px';
        iframeRef.style.border = '10px dashed cyan';
        iframeRef.style.padding = '5px';
        iframeRef.style.height = '50rem';
    };

    const handleApiReady = (apiObj, ref) => {
        ref.current = apiObj;
        ref.current.addEventListeners({
            // Listening to events from the external API
            participantJoined: payload => handleParticipantChanged(payload, apiObj),
            participantLeft: payload => handleParticipantChanged(payload, apiObj),
            raiseHandUpdated: printEventOutput,
            tileViewChanged: printEventOutput
        });
    };


    return (
        <>
            <h1 style={{
                fontFamily: 'sans-serif',
                textAlign: 'center'
            }}>sudoroom telepresence portal</h1>
            <JitsiMeeting
                domain="meet.waag.org"
                roomName="turtlesturtlesturtles"
                onApiReady={externalApi => handleApiReady(externalApi, apiRef)}
                getIFrameRef={handleJitsiIFrameRef}
            />
        </>
    );
};

export default App;
