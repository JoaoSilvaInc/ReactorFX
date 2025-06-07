
import { ReactorFXConfig } from './contracts/ConfigContracts';
import { getLocalConfig, applyConfigToEnv } from './config';

const config = (await getLocalConfig()) as ReactorFXConfig;
applyConfigToEnv(config);

// Load static strategies
// Handle dynamic strategies stuff
// Load static elms to handle
// Listen to scanner events
// Trigger nexus events and coordinate it

export { ReactorFX } from './ReactorFX';