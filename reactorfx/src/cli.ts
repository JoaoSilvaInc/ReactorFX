#!/usr/bin/env node
import { initReactorFX } from "./cli/init";

const args = process.argv.slice(2);
if (args.includes('--init') || args.includes('-i')) {
    initReactorFX();
}