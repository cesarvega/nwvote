import {
    patchState,
    signalStore,
    withComputed,
    withMethods,
    withState
} from "@ngrx/signals";
import {computed} from "@angular/core";
import {Message} from "../+models/message";
import {Baseline} from "../+models/baseline";
import {Internet} from "../+models/internet";
import {withStorageSync} from "./storege-sync.feature";
import {environment} from "../../../environments/environment";


type AppState = {
    urlSearchParams: any,
    saleCodeResponse: any,
    transactionRequest: any,
    transactionResponse: any,
    internetResponse: any,
    addressQualificationRequest: any,
    addressQualificationResponse: any,
    customerInformation: any,
    messageInfo: Message,
    isgAwsToken: string,
    loading: boolean
}

const initialStateMessage: Message = {message: '', description: '', icon: 'info', display: false};

const initialState: AppState = {
    urlSearchParams: null,
    saleCodeResponse: null,
    transactionRequest: null,
    transactionResponse: null,
    internetResponse: null,
    addressQualificationRequest: null,
    addressQualificationResponse: null,
    customerInformation: null,
    messageInfo: initialStateMessage,
    isgAwsToken: '',
    loading: false
};

export const BMX_STORE = signalStore(
    {providedIn: "root"},
    withState(initialState),
    withStorageSync({
        key: environment.provider.toLowerCase(),
    }),
    withMethods(
        (
            store
        ) => ({
            clearStore() {
                patchState(store, initialState);
                store.clearStorage();
            },
            updateUrlSearchParams(newUrlSearchParams: URLSearchParams) {
                patchState(store, {urlSearchParams: newUrlSearchParams});
            },
            updateIsLoading(isLoading: boolean) {
                patchState(store, {loading: isLoading});
            },
            updateTransactionResponse(Response: any) {
                patchState(store, {transactionResponse: Response});
            },
            updateTransactionRequest(transactionRequest: any) {
                patchState(store, {transactionRequest: transactionRequest});
            },
            updateAddressQualificationRequest(Request: any) {
                patchState(store, {addressQualificationRequest: Request});
            },
            updateAddressQualificationResponse(Response: any) {
                patchState(store, {addressQualificationResponse: Response});
            },
            updateCustomerInfo(data: any) {
                patchState(store, {customerInformation: data});
            },
            updateMessageInfo(data: Message) {
                patchState(store, {messageInfo: data});
            },
            resetMessageInfo() {
                patchState(store, {messageInfo: initialStateMessage});
            },
            updateIsgAwsToken(token: string) {
                patchState(store, {isgAwsToken: token});
            },
            updateSaleCodeResponse(data: any) {
                patchState(store, {saleCodeResponse: data});
            },
            updateInternetResponse(data: any) {
                patchState(store, {internetResponse: data});
            },
            internet(): Internet {
                const entity = store.addressQualificationResponse()?.context?.entity;

                return {
                    "marketSegment": 'CON',
                    "qualForExternalVideo": false,
                    "addressDetailId": entity.addressId,
                    "propertyId": entity.propertyId === null ? '' : entity.propertyId,
                    //"propertyId": entity.addressId,
                    "fullAddress": entity.fullAddress,
                    "instantInternet": entity.instantInternet,
                    "lineType": '',
                    "customerType": 'Residential',
                    "productType": '',
                    "speed": entity?.o2Details?.FastestDownloadDataService?.downstreamBandwidth,
                    "provisioningCode": entity?.o2Details?.FastestDownloadDataService?.serviceName
                };
            },
            baseline(): Baseline {
                const entity = store.addressQualificationResponse()?.context?.entity;
                const agentId = store.urlSearchParams().agentId;

                return {
                    transactionId: entity.partnerSessionId,
                    partnerId: entity.partnerId,
                    salesCode: entity.salesCode,
                    partnerOrderId: store.transactionResponse().uuid,
                    agentId: agentId ? agentId : 'N/A',
                    channel: entity.channel,
                    siteId: entity.siteId,
                    wirecenter: entity.wireCenter,
                    intent: entity.intent
                };
            },
            getInternetProducts(): any {
                return store.internetResponse()?.productResponse?.productDetails;
            }
        })
    ),
    withComputed((store) => ({
        getFullName: computed(() => {
            return store.customerInformation().firstName + ' ' + store.customerInformation().lastName;
        }),
        getIsgAwsToken: computed(() => {
            return store.isgAwsToken();
        })
    }))
);
