/** Type of repository */
export enum PlaceRepositoryType {
    /** Repository is a collection of Driver logic */
    Driver = 'Driver',
    /** Repository is a collection of interfaces */
    Interface = 'Interface',
}

export interface PlaceRepositoryCommitQuery {
    /** URL encoded name of the driver being requested */
    driver?: string;
}

export interface GitCommitDetails {
    /** Name of the commit author */
    author: string;
    /** Short hash of the commit */
    commit: string;
    /** ISO datetime string for commit  */
    date: string;
    /** Commit summary */
    subject: string;
}

export interface PlaceRepositoryDetailsQuery {
    /** URL encoded name of the driver being requested */
    driver: string;
    /** Hash of the commit being requested for the driver */
    commit: string;
}

export interface PlaceRepositoryPullQuery {
    /** Hash of the commit being requested */
    commit: string;
}

/** Metadata for a repository commit */
export interface PlaceRepositoryCommit {
    /** Hash associated with the commit */
    commit: string;
    /** UTC epoch in seconds of the time the commit was made */
    date: number;
    /** Author of the commit */
    author: string;
    /** Commit subject line */
    subject: string;
}
