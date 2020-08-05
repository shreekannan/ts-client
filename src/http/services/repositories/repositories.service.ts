import { Observable } from 'rxjs';
import { HashMap } from '../../../utilities/types.utilities';
import { PlaceDriverDetails } from '../drivers/drivers.interfaces';
import { create, query, remove, show, task, update } from '../resources/resources.service';
import { PlaceRepository } from './repository.class';
import {
    GitCommitDetails,
    PlaceRepositoryCommitQuery,
    PlaceRepositoryDetailsQuery,
    PlaceRepositoryPullQuery
} from './repository.interfaces';

const PATH = 'repositorys';
const NAME = 'Repositorys';

function process(item: HashMap) {
    return new PlaceRepository(item);
}

export function queryRepositories(query_params?: HashMap) {
    return query(query_params, process, PATH);
}

export function showRepository(id: string, query_params: HashMap = {}) {
    return show(id, query_params, process, PATH);
}

export function updateRepository(
    id: string,
    form_data: HashMap | PlaceRepository,
    query_params: HashMap = {},
    method: 'put' | 'patch' = 'patch'
) {
    return update(id, form_data, query_params, method, process, PATH);
}

export function addRepository(form_data: HashMap, query_params: HashMap = {}) {
    return create(form_data, query_params, process, PATH);
}

export function removeRepository(id: string, query_params: HashMap = {}) {
    return remove(id, query_params, PATH);
}

/**
 * Get a list of all the interfaces
 * @param query_params Addition query parameters to pass to the request
 */
export function listInterfaceRepositories(query_params: HashMap = {}): Observable<string[]> {
    return show('interfaces', query_params, undefined, PATH);
}

/**
 * Get a list of all the drivers for a repository
 * @param id ID of the repository
 * @param query Addition query parameters to pass to the request
 */
export function listRepositoryDrivers(id: string, query_params?: HashMap): Observable<string[]> {
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
