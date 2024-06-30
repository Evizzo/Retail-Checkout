import {apiClient} from './ApiClient'; 

export const executeJwtAuthenticationService = (username: string, password: string) => {
    return apiClient.post(`/auth/authenticate`, { username, password });
}

export const executeLogout = () => {
    return apiClient.post(`/auth/logout`);
}

export const executeFindBillsByUserId = () => {
    return apiClient.get(`/bill`);
}

export const executeSaveBill = (bill: any) => {
    return apiClient.post(`/bill`, bill);
}

export const executeFindBillById = (billId: any) => {
    return apiClient.get(`/bill/${billId}`);
}

export const executeRetrieveStoreArticles = () => {
    return apiClient.get(`/store-articles`);
}