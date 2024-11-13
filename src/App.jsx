/* eslint-disable no-undef */
import { JitsiMeeting } from '@jitsi/web-sdk';
import React, { useRef, useState } from 'react';

const monitorServerUrl = 'http://localhost:8100/ducks';
const turnMonitorOnUrl = `${monitorServerUrl}/open`;
const turnMonitorOffUrl = `${monitorServerUrl}/close`;

const App = () => {
    const apiRef = useRef();
    const apiRefNew = useRef();

    const printEventOutput = payload => {
        console.log(items => [ ...items, JSON.stringify(payload) ]);
    };

    const handleParticipantChanged = (payload, api) => {
        const pInfo = api.getParticipantsInfo();
        let url;
        if (pInfo.length === 2 &&
            pInfo[0].displayName === pInfo[1].displayName)
            {
                url = turnMonitorOffUrl
            } else {
                url = pInfo.length > 1 ? turnMonitorOnUrl : turnMonitorOffUrl;
            }
        let req = new Request(url);
        fetch(req)
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
