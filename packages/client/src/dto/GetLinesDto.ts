import { LineDto } from "./LineDto";

export interface GetLinesDto {

    matchFilters?: string;

    prefixFilters?: string;

    afterLine?: LineDto;

    maxLines: number;

    direction?: "ASC" | "DESC";

}
