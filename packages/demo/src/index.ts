import { BifrostLogStreamer } from "@project-ncl/bifrost-web-component";

const root: HTMLElement = document.getElementById("root");

const stream = new BifrostLogStreamer();

root.append(stream);

stream.appendLine("testing 1, 2, 3");
