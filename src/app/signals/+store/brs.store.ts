import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState
} from "@ngrx/signals";
import {computed} from "@angular/core";
import {Message} from "../+models/message";
import {withStorageSync} from "./storege-sync.feature";
import {environment} from "../../../environments/environment";


type AppState = {
    company: any,
    data: any,
    directors: any,
    projectId: any,
    projectName: any,
    templates: any,
    userData: any,
    userGui: any,
    currentProjectInfo: any,
    projectList:any,
    messageInfo: Message,
} 

const initialStateMessage: Message = {message: '', description: '', icon: 'info', display: false};

const initialState: AppState = {
    company: null,
    data: null,
    directors: null,
    projectId: '',
    projectName: '',
    templates: null,
    userData: null,
    userGui: null,
    currentProjectInfo: null, 
    projectList: null,
    messageInfo: initialStateMessage
};
const syncConfig = {
    key: 'appState', 
    storage: () => localStorage, 
    partialState: ['company', 'data', 'directors', 'projectId', 'projectName', 'templates', 'userData', 'userGui', 'currentProjectInfo', 'projectList', 'messageInfo'],  // Claves a sincronizar
};

export const BMX_STORE = signalStore(
    { providedIn: "root" },
    withState(initialState),
    withStorageSync({
        key: 'appState', 
        storage: () => localStorage, 
    }),  
    
    withMethods((store) => ({
        updateCompany(companyData: any) {
            patchState(store, { company: companyData });
        },
        updateData(data: any) {
            patchState(store, { data: data });
        },
        updateDirectors(directorData: any) {
            patchState(store, { directors: directorData });
        },
        updateProjectId(id: string) {
            patchState(store, { projectId: id });
        },
        updateProjectName(name: string) {
            patchState(store, { projectName: name });
        },
        updateTemplates(templateData: any) {
            patchState(store, { templates: templateData });
        },
        updateUserData(userData: any) {
            patchState(store, { userData: userData });
        },
        updateUserGui(userGuiData: any) {
            patchState(store, { userGui: userGuiData });
        },
        updateMessageInfo(data: Message) {
            patchState(store, {messageInfo: data});
        },
        resetMessageInfo() {
            patchState(store, {messageInfo: initialStateMessage});
        },
        updateProjectInfo(data: Message) {
            patchState(store, {currentProjectInfo: data});
        },
        updateProjectList(data: Message) {
            patchState(store, {projectList: data});
        },
    }))
);
