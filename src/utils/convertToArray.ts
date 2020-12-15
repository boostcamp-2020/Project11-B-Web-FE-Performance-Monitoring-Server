export default function covertToArray<T>(element: T | T[]): T[] {
  if (Array.isArray(element)) {
    return element;
  }
  return [element];
}
