import { Observable } from 'rxjs';
import { HashMap } from '../utilities/types';
import { PlaceDriverDetails } from '../drivers/interfaces';
import {
    create,
    query,
    remove,
    show,
    task,
    update,
} from '../resources/functions';
import { PlaceRepository } from './repository';
import {
    GitCommitDetails,
    PlaceRepositoryCommitQuery,
    PlaceRepositoryDetailsQuery,
    PlaceRepositoryPullQuery,
} from './interfaces';

/**
 * @private
 */
const PATH = 'repositories';

/** Convert raw server data to a repository object */
function process(item: HashMap) {
    return new PlaceRepository(item);
}

/**
 * Query the available repositories
 * @param query_params Query parameters to add the to request URL
 */
export function queryRepositories(query_params?: HashMap) {
    return query(query_params, process, PATH);
}

/**
 * Get the data for a repository
 * @param id ID of the repository to retrieve
 * @param query_params Query parameters to add the to request URL
 */
export function showRepository(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

/**
 * Update the repository in the database
 * @param id ID of the repository
 * @param form_data New values for the repository
 * @param query_params Query parameters to add the to request URL
 * @param method HTTP verb to use on request. Defaults to `patch`
 */
export function updateRepository(
    id: string,
    form_data: HashMap | PlaceRepository,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

/**
 * Add a new repository to the database
 * @param form_data Repository data
 * @param query_params Query parameters to add the to request URL
 */
export function addRepository(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

/**
 * Remove an repository from the database
 * @param id ID of the repository
 * @param query_params Query parameters to add the to request URL
 */
export function removeRepository(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Get a list of all the interfaces
 * @param query_params Addition query parameters to pass to the request
 */
export function listInterfaceRepositories(
    query_params: HashMap = {}
): Observable<string[]> {
    return show('interfaces', query_params, undefined, PATH);
}

/**
 * Get a list of all the drivers for a repository
 * @param id ID of the repository
 * @param query Addition query parameters to pass to the request
 */
export function listRepositoryDrivers(
    id: string,
    query_params?: HashMap
): Observable<string[]> {
    return task(id, 'drivers', query_params, 'get', undefined, PATH);
}

/**
 * Get a list of all the commits for a repository
 * @param id ID of the repository
 * @param query Addition query parameters to pass to the request
 */
export function listRepositoryCommits(
    id: string,
    query_params?: PlaceRepositoryCommitQuery
): Observable<GitCommitDetails[]> {
    return task(id, 'commits', query_params, 'get', undefined, PATH);
}

/**
 * Get a list of all the branches for a repository
 * @param id ID of the repository
 */
export function listRepositoryBranches(id: string): Observable<string[]> {
    return task(id, 'branches', undefined, 'get', undefined, PATH);
}

/**
 * Get the details for a given driver
 * @param id ID of the repository
 * @param query Addition query parameters to pass to the request
 */
export function listRepositoryDriverDetails(
    id: string,
    query_params: PlaceRepositoryDetailsQuery
): Observable<PlaceDriverDetails> {
    return task(id, 'details', query_params, 'get', undefined, PATH);
}

/**
 * Pull remote changes to tshe repository
 * @param id ID of the repository
 * @param query Addition query parameters to pass to the request
 */
export function pullRepositoryChanges(
    id: string,
    query_params?: PlaceRepositoryPullQuery
): Observable<GitCommitDetails> {
    return task(id, 'pull', query_params, 'post', undefined, PATH);
}
