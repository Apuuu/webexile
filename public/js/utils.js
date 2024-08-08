export default class Utils {
    clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }
}