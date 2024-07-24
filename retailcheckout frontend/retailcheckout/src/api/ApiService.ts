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

export const executeSaveBill = (bill: any, code?: string) => {
    const url = code ? `/bill?code=${encodeURIComponent(code)}` : `/bill`;
    return apiClient.post(url, bill);
};

export const executeFindBillById = (billId: any) => {
    return apiClient.get(`/bill/${billId}`);
}

export const executeRetrieveStoreArticles = () => {
    return apiClient.get(`/store-articles`);
}

export const executeFindStoreArticleBySerialNumber = (serialNumber: string) => {
    return apiClient.get(`/store-articles/${serialNumber}`);
}

export const executeCodeRedeem = (code: string, pointsToRedeem: number, totalBillPrice: number) => {
    return apiClient.put(`/loyalty-card/redeem?code=${encodeURIComponent(code)}&pointsToRedeem=${pointsToRedeem}&totalBillPrice=${totalBillPrice}`);
}

export const executeGetAvailablePoints = (code: string) => {
    return apiClient.get(`/loyalty-card/points?code=${encodeURIComponent(code)}`);
}