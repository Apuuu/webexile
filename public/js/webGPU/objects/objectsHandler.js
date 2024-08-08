import Rectangle from "./rectangle.object.js";

export default class ObjectsHandler {
    createObject(type, ...params) {
        switch (type) {
            case "rectangle":
                return new Rectangle(...params);
            default:
                console.error("Unknown object type");
                return null;
        }
    }
}