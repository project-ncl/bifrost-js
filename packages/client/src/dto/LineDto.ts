export interface LineDto {
    id: string;

    timestamp: string;

    logger: string;

    message: string;

    last: boolean;

    ctx?: string;

    tmp?: boolean;

    exp?: string;

    subscriptionTopic?: string;
}
