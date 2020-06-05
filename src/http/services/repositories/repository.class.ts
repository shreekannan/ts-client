import { HashMap } from '../../../utilities/types.utilities';
import { EngineResource } from '../resources/resource.class';
import { EngineRepositoriesService } from './repositories.service';
import { EngineRepositoryType } from './repository.interfaces';

import * as _dayjs from 'dayjs';
// tslint:disable-next-line:no-duplicate-imports
import { Dayjs, default as _rollupDayjs } from 'dayjs';
/**
 * @hidden
 */
const dayjs = _rollupDayjs || _dayjs;

export const REPOSITORY_MUTABLE_FIELDS = ['name', 'folder_name', 'description', 'uri', 'commit_hash', 'repo_type'] as const;
type RepositoryMutableTuple = typeof REPOSITORY_MUTABLE_FIELDS;
export type RepositoryMutableFields = RepositoryMutableTuple[number];

export class EngineRepository extends EngineResource<EngineRepositoriesService> {

    /** Name of the folder on the server to pull the repository */
    public readonly folder_name: string;
    /** Description of the contents of the repository */
    public readonly description: string;
    /** URI that the repository can be pulled from */
    public readonly uri: string;
    /** Working branch for the repository */
    public readonly branch: string;
    /** Hash of the commit at the head of the repository */
    public readonly commit_hash: string;
    /** Repository type */
    public readonly repo_type: EngineRepositoryType;
    /** Class type of required service */
    protected __type: string = 'EngineRepository';

    /** Repository type */
    public get type(): EngineRepositoryType {
        return this.repo_type;
    }

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.folder_name = raw_data.folder_name || '';
        this.description = raw_data.description || '';
        this.uri = raw_data.uri || '';
        this.branch = raw_data.branch || 'master';
        this.commit_hash = raw_data.commit_hash || '';
        this.repo_type = typeof raw_data.repo_type === 'string' ? raw_data.repo_type as any : EngineRepositoryType.Driver;
    }

    public storePendingChange(
        key: RepositoryMutableFields,
        value: EngineRepository[RepositoryMutableFields]
    ): this {
        return super.storePendingChange(key as any, value);
    }
}
