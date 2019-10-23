/**
 * An implementation for objects to clone a type - usually themselves - allowing the clone's data to be altered while keeping the original intact.
 */
interface ICloneable<T> {
    /**
     * Clones an object of the specified type.
     * @returns The clone of the object.
     */
    clone(): T;
}