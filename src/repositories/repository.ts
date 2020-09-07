import { HashMap } from '../utilities/types';
import { PlaceResource } from '../resources/resource';
import { PlaceRepositoryType } from './interfaces';

export class PlaceRepository extends PlaceResource {
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
    public readonly repo_type: PlaceRepositoryType;
    /** Username to connect to repository with */
    public readonly username: string;
    /** Password to connect to repository with */
    public readonly password: string;

    /** Repository type */
    public get type(): PlaceRepositoryType {
        return this.repo_type;
    }

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.folder_name = raw_data.folder_name || '';
        this.description = raw_data.description || '';
        this.uri = raw_data.uri || '';
        this.branch = raw_data.branch || 'master';
        this.commit_hash = raw_data.commit_hash || '';
        this.repo_type =
            typeof raw_data.repo_type === 'string'
                ? (raw_data.repo_type as any)
                : PlaceRepositoryType.Driver;
        this.username = raw_data.username || '';
        this.password = raw_data.password || '';
    }
}
