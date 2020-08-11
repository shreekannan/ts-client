import { HashMap } from '../utilities/types';
import { PlaceResource } from '../resources/resource';
import { EncryptionLevel } from './interfaces';

export class PlaceSettings extends PlaceResource {
    /** ID of the parent zone/system/module/driver */
    public readonly parent_id: string;
    /** Unix timestamp in seconds of when the settings where last updated */
    public readonly updated_at: number;
    /** Access level for the settings data */
    public readonly encryption_level: EncryptionLevel;
    /** Contents of the settings */
    public readonly settings_string: string;
    /** Top level keys for the parsed settings */
    public readonly keys: string[];

    /** Contents of the settings */
    public get value(): string {
        return this.settings_string;
    }

    constructor(raw_data: HashMap = {}) {
        super(raw_data);
        this.parent_id = raw_data.parent_id || '';
        this.updated_at =
            raw_data.updated_at || Math.floor(new Date().getTime() / 1000);
        this.settings_string = raw_data.settings_string || '';
        this.encryption_level =
            raw_data.encryption_level || EncryptionLevel.None;
        this.keys = raw_data.keys || [];
    }
}
