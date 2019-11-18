import BifrostLogViewerComponent from "./bifrostLogViewer.js";
import BifrostClient from "@project-ncl/bifrost-client";
import { BifrostLogViewer, LogViewer } from "@project-ncl/bifrost-web-component";

angular.module("bifrost", [])
       .component("ngBifrostLogViewer", BifrostLogViewerComponent);

const bifrost = {
    client: BifrostClient,
    BifrostLogViewer,
    LogViewer
};

export default bifrost;
