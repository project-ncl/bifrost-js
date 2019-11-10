import BifrostClient from "@project-ncl/bifrost-client";
import { LineDto } from "@project-ncl/bifrost-client/dist/types/dto/LineDTO";
import { BifrostLogStreamer } from "@project-ncl/bifrost-web-component";

console.log(process.env.BIFROST_HOST);
const BIFROST_HOST: string = process.env.BIFROST_HOST;

const root: HTMLElement = document.getElementById("root");

const stream = new BifrostLogStreamer();

root.append(stream);

for (let i = 0; i < 2000; i++) {
    stream.appendLine("[INFO] Downloaded from indy-mvn: http://indy.newcastle.svc.cluster.local/api/folo/track/build-36047/maven/group/build-36047/org/sonatype/plexus/plexus-build-api/0.0.7/plexus-build-api-0.0.7.jar (8.5 kB at 30 kB/s)");
}

//const client: BifrostClient = new BifrostClient(BIFROST_HOST, true);

// function appendLine(...lines: LineDto[]) {
//     for (const line of lines) {
//         stream.appendLine(`[${line.timestamp}] ${line.message}`);
//     }
// }

// const buildId: number = 339;
// client.subscribe({ matchFilters: "loggerName.keyword:org.jboss.pnc._userlog_", prefixFilters: `mdc.processContext.keyword:build-${buildId}` },
//         (line) => {
//             appendLine(line);
//         });


// client.getLines({
//     maxLines: 20,
//     prefixFilters: `mdc.processContext.keyword:build-${buildId}`,
//     matchFilters: "loggerName.keyword:org.jboss.pnc._userlog_"
// }).then(lines => {
//     appendLine(...lines);
// });

