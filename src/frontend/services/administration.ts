import { resourceService } from './resource';
export const administrationServices = Object.fromEntries(['entities','provinces','establishments','faculties','departments','options','users','roles','assignments','ip-rules','pricing','currencies'].map(key=>[key,resourceService(key)]));
