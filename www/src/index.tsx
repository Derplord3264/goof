import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/App";

const key = window.location.pathname.split('/')[2]

// setup connection 
const conn = new WebSocket("ws://" + window.location.host + "/ws/" + key);
conn.onclose = function (e) {
    console.log(e)
};

conn.onopen = function (e) {
    ReactDOM.render(
        <App key={key} conn={conn}/>,
        document.getElementById("app")
    )
}
