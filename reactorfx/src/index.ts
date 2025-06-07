
import { ReactorFXConfig } from './contracts/ConfigContracts';
import { getLocalConfig, applyConfigToEnv } from './config';

const config = (await getLocalConfig()) as ReactorFXConfig;
applyConfigToEnv(config);

export { ReactorFXVitePlugin } from './plugins/ReactorFXVitePlugin'
export { ReactorFX } from './ReactorFX';