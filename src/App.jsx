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
        iframeRef.style.overflow = 'hidden';
        iframeRef.style.border = '0px dashed cyan';
        iframeRef.style.margin = '0';
        iframeRef.style.padding = '0';
        iframeRef.style.height = '100%';
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
