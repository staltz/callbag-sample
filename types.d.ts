import { Source } from 'callbag'

declare const sample: <T>(pullable: Source<T>) => (listenable: Source<any>) => Source<T>;
export default sample;