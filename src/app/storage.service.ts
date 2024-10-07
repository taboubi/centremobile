import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    private _storage: Storage | null = null;

    constructor(private ionStorage: Storage) {
        this.init();
    }

    async init() {

        if (this._storage != null) {
            return;
        }
        const storage = await this.ionStorage.create();
        this._storage = storage;
    }

    /**
     * Get the value associated with the given key
     * @param key Any key will be juntioned with the APP_PREFIX constant
     */
    async get(key: string): Promise<any> {
        return await this._storage?.get(key);
    }

    /**
     * Set the value for the given key
     * @param key Any key will be juntioned with the APP_PREFIX constant
     * @param value Any value will be stringified
     */
    async set(key: string, value: any): Promise<any> {
        // return this.storage.set(`${APP_CONSTANTS.APP_PREFIX}-${key}`, value)
        //     .then(() => true)
        //     .catch(e => { throw e });

        await this.init();
        return await this._storage?.set(key, value);
    }
}