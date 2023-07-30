import { newStep } from "./monitoring.js";

async function execute(fn, interval) {
    try {
        const result = await fn();
        if (!result) {
            throw new Error(`Data load failed`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => execute(fn, interval), interval);
    }
}

const interval1Hour = 3600000;

(async () => {
    await execute(newStep, interval1Hour);
})();

