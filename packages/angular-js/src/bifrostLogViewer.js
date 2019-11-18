import { BifrostLogViewer } from "@project-ncl/bifrost-web-component";

class BifrostLogViewerController {
    constructor($element) {
        this.$element = $element;
        this.$postLink = this.$postLink.bind(this);
    }

    $postLink() {
        const bifrostElem = new BifrostLogViewer(this.bifrostHost, { prefixFilters: this.prefixFilters, matchFilters: this.matchFilters });
        this.$element.append(bifrostElem);
    }
}

BifrostLogViewerController.$inject = ["$element"];

export default {
    controller: BifrostLogViewerController,
    bindings: {
        bifrostHost: "<",
        matchFilters: "<",
        prefixFilters: "<"
    }
}
