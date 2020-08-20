import { LogViewer } from "@project-ncl/bifrost-web-component";

const root: HTMLElement = document.getElementById("root");

const mockLines = [
    `2019-07-16 12:02:41,993 [INFO] repour.server.endpoint.endpoint:238 Creating callback task B53X24PHHFRW4Q4N344K7ETGON4X6WXKLGNO2XEJMVGL667C, returning ID now`,
    `2019-07-16 12:02:41,994 [INFO] aiohttp.access:473 172.54.10.1 [16/Jul/2019:12:02:41 +0000] "POST /adjust HTTP/1.1" 202 1963 "-" "Apache-HttpClient/4.3.6.redhat-1 (java 1.5)"`,
    `2019-07-16 12:02:41,994 [INFO] repour.adjust.adjust:134 Build Type specified: MVN`,
    `2019-07-16 12:02:41,995 [INFO] repour.adjust.adjust:36 Auto-Sync feature activated`,
    `2019-07-16 12:02:41,995 [INFO] repour.asutil:131 Running command: ['git', 'clone', '--', 'https://github.com/project-ncl/pnc.git', '/tmp/tmprx_n5uvhgit']`,
    `2019-07-16 12:03:30,616 [INFO] repour.asutil:131 Running command: ['git', 'show-ref', '--quiet', '--tags', '*/v0.2', '--']`,
    `2019-07-16 12:03:30,625 [INFO] repour.asutil:131 Running command: ['git', 'fetch']`,
    `2019-07-16 12:03:31,370 [INFO] repour.asutil:131 Running command: ['git', 'show-branch', 'remotes/origin/*/v0.2']`,
    `2019-07-16 12:03:31,378 [INFO] repour.asutil:131 Running command: ['git', 'checkout', '*/v0.2', '-f']`,
    `2019-07-16 12:03:31,406 [ERROR] repour.asutil.stderr:154 error: pathspec '*/v0.2' did not match any file(s) known to git.`,
    `2019-07-16 12:03:31,417 [ERROR] repour.server.endpoint.endpoint:149 Failed (CommandError), traceback hash: 05f8f1a04a203cf17303236a9f37059d`,
    `2019-07-16 12:03:31,417 [ERROR] repour.server.endpoint.endpoint:58 Traceback (most recent call last):`,
    `2019-07-16 12:03:31,417 [ERROR] repour.server.endpoint.endpoint:58   File "/opt/repour/repour/server/endpoint/endpoint.py", line 140, in do_call`,
    `2019-07-16 12:03:31,417 [ERROR] repour.server.endpoint.endpoint:58     ret = await coro(spec, **request.app)`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58   File "/opt/repour/repour/adjust/adjust.py", line 143, in adjust`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58     await sync_external_repo(adjustspec, repo_provider, work_dir, c)`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58   File "/opt/repour/repour/adjust/adjust.py", line 80, in sync_external_repo`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58     await git["checkout"](work_dir, adjustspec["ref"], force=True)  # Checkout ref`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58   File "/opt/repour/repour/scm/git_provider.py", line 63, in checkout`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58     print_cmd=True`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58   File "/opt/repour/repour/asutil.py", line 162, in expect_ok`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58     stderr=stderr_text,`,
    `2019-07-16 12:03:31,418 [ERROR] repour.server.endpoint.endpoint:58 repour.exception.CommandError: Could not checkout ref */v0.2 with git`,
    "2019-07-16 12:03:31,418 [WARN] Downloaded from indy-mvn: http://indy.newcastle.svc.cluster.local/api/folo/track/build-36047/maven/group/build-36047/org/sonatype/plexus/plexus-build-api/0.0.7/plexus-build-api-0.0.7.jar (8.5 kB at 30 kB/s)"
];

function getRandomLine() {
    const index = Math.floor(Math.random() * mockLines.length);
    return mockLines[index];
}


function mockStreamLog(viewer: LogViewer, iterations: number, delay: number) {
    if (iterations <= 0) {
        return;
    }
    setTimeout(() => {
        viewer.appendLine(getRandomLine());
        mockStreamLog(viewer, iterations - 1, delay);
    }, delay);
}

const logViewer = new LogViewer();

root.append(logViewer);

logViewer.addEventListener("onLoadMore", () => {
    const lines: string[] = [];

    for (let i = 0; i < 25; i++) {
        lines.push(getRandomLine());
    }
    logViewer.prependLines(lines);
});


mockStreamLog(logViewer, 10000, 200);
