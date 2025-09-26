import { getAccessToken } from "../libs/actions";
import { redirect } from 'next/navigation';


const apiService = {

async _request(url: string, method: string, data?: any): Promise<any> {
        const token = await getAccessToken();
        const options: RequestInit = { method };

        const headers = new Headers();
        if (token) {
            headers.append('Authorization', `Bearer ${token}`);
        }

        if (data) {
            if (data instanceof FormData) {
                options.body = data;
            } else {
                headers.append('Content-Type', 'application/json');
                options.body = JSON.stringify(data);
            }
        }
        options.headers = headers;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, options);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
                throw new Error(`Erreur HTTP ${response.status}: ${errorData.detail || errorData.message}`);
            }

            if (response.status === 204) { 
                return null;
            }

            const json = await response.json();
            console.log('Response:', json);
            return json;

        } catch (error) {
            console.error(`Erreur de l'API (${method} ${url}):`, error);
            throw error; 
        }
    },

    get: function(url: string): Promise<any> {
        return this._request(url, 'GET');
    },

    post: function(url: string, data: any): Promise<any> {
        return this._request(url, 'POST', data);
    },

    delete: function(url: string): Promise<any> {
        return this._request(url, 'DELETE');
    },
    
    put: function(url: string, data: any): Promise<any> {
        return this._request(url, 'PUT', data);
    },


postWithoutToken: async function(url: string, data: any): Promise<any> {
    console.log('post', url, data);

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            body: data,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(async(response) => {
                console.log('Response:', response);
                const parsedResponse = await response.json();
                resolve({
                status: response.status,
                data: parsedResponse
                });
            })
            .catch((error => {
                reject(error);
            }))
    })
},

fetch_proxy : async function (method: string, url: string , data?: any): Promise<any> {

    const token = await getAccessToken();
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
    },
      body: method === "GET" || method === "HEAD" ? undefined : JSON.stringify(data)
    };

    const response = await fetch(`/api${url}`, options);
    
    if (response.status === 401) {
        redirect('/login'); 
    }

    if (!response.ok) {
        // Gérer les autres erreurs HTTP (404, 500, etc.)
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        const error = new Error(`Erreur HTTP ${response.status}: ${errorData.message || response.statusText}`);
        throw error;
    }
    
    // Si la réponse peut être vide (ex: statut 204 No Content)
    if (response.status === 204) {
        return null;
    }

    const json = await response.json();
    console.log('Response:', json);
    return json;

  },

}

export default apiService;


