
import * as fs from 'fs'
import * as path from 'path';
import { pathToFileURL } from 'url';

import { ReactorFXProjectConfig } from "../../contracts/ConfigContracts/ReactorFXProjectConfig";
import { getRootPath } from "../../utils/fileHandling";

/**
 * 
 * @returns The 'reactorfx.config.ts' config
 * @remarks Returns {@link DEFAULT_PROJECT_CONFIG} if 'reactorfx.config.ts does' not exist
 */
export async function getProjectConfig(): Promise<ReactorFXProjectConfig> {

    const localProjectRoot = getRootPath();
    const customConfigPath = path.join(localProjectRoot, 'reactorfx.config.ts');

    const rootConfig: ReactorFXProjectConfig = {
        projectRoot: localProjectRoot,
        configSource: '/package.json',
        configKey: 'reactorfx',
    };

    if (fs.existsSync(customConfigPath)) {
        
        const configModule = await import(pathToFileURL(customConfigPath).href);
        const configExport = (configModule.default || configModule.config || configModule);

        rootConfig.projectRoot = configExport.projectRoot;
        rootConfig.configSource = configExport.configSource;
        rootConfig.configKey = configExport.configKey;

    }

    return rootConfig;
}