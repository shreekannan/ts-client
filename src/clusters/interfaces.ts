/** Mapping of available query paramters for the application index endpoint */
export interface PlaceClusterQueryOptions {
    /** Whether the cluster status details should be included */
    include_status?: string;
    /** Number of results to return. Defaults to `20`. Max `500` */
    limit?: number;
    /** Offset the page of results. Max `10000` */
    offset?: number;
}
