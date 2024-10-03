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
    messageInfo: initialStateMessage
};
export const BMX_STORE = signalStore(
    { providedIn: "root" },
    withState(initialState),
    
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
        
    }))
);
