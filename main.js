import { newStep } from "./monitoring.js";

async function execute(fn, interval) {
    try {
        const result = await fn();
        if (result) {

            console.log(`Success for load APY`)
        }
        else {
            throw new Error(`Data load failed`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setTimeout(() => execute(fn, interval), interval);
    }
}

const interval1Hour = 3000000;

setTimeout(() => execute(newStep, interval1Hour), 0);
