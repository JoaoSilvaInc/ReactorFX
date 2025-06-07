
import * as path from 'path';
import { DEFAULT_CONFIG } from '../constants';

import { ReactorFXConfig, isReactorFXConfig } from '../../contracts/ConfigContracts';
import { getProjectConfig } from './readProjectConfig';

import { readJsonProp } from '../../utils/fileHandling';

/**
 * Looks for 'reactorfx' in package.json
 * 
 * @returns ReactorFXConfig
 * @remarks Returns {@link DEFAULT_CONFIG} if the reactorfx config isn't setted in package.json
 */
export async function getLocalConfig(): Promise<ReactorFXConfig> {
    
    const {projectRoot, configSource, configKey} = (await getProjectConfig());
    const cnfgFilePath: string = path.join(projectRoot, configSource);

    let config: ReactorFXConfig;

    try {
        const foundConfig = readJsonProp(cnfgFilePath, configKey) as ReactorFXConfig;
        if (isReactorFXConfig(foundConfig)) {
            config = foundConfig
        } else {
            throw new Error(`[reactorfx] ${JSON.stringify(foundConfig)} is invalid. Expected shape: { paths: {main: string, animations: string} }`);
        }
    } catch (err) {
        config = DEFAULT_CONFIG;
        console.warn(`[reactorfx] Using default config beacause reading reactorfx config failed:`, err);
    }

    return config;

}