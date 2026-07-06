import axios from 'axios';
import {
    CreateParams, CreateResult, DataProvider, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult,
    GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult,
    Identifier, QueryFunctionContext, RaRecord, UpdateManyParams, UpdateManyResult, UpdateParams, UpdateResult
} from 'react-admin';
const apiUrl = 'http://localhost:8080/api';

const httpClient = {
    get: (url: string) => {
        const token = localStorage.getItem('jwt-token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        return axios.get(url, {
            headers,
            withCredentials: true,
        })
            .then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },

    post: (url: string, data: any) => {
        const token = localStorage.getItem('jwt-token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        return axios.post(url, data, {
            headers,
            withCredentials: true,
        })
            .then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },

    put: (url: string, data: any) => {
        const token = localStorage.getItem('jwt-token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        return axios.put(url, data, {
            headers,
            withCredentials: true,
        })
            .then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },

    delete: (url: string, p0: { data: { ids: any[]; }; }) => {
        const token = localStorage.getItem('jwt-token');
        const headers: any = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        return axios.delete(url, {
            headers,
            withCredentials: true,
        })
            .then(response => ({ json: response.data }))
            .catch(error => {
                console.error('API request failed:', error);
                throw error;
            });
    },
};

export const dataProvider: DataProvider = {
    getList: (resource: string, { pagination = {}, sort = {}, filter = {} }) => {
        const { page = 0, perPage = 10 } = pagination;
        const { field = 'id', order = 'ASC' } = sort;

        const idFieldMapping: { [key: string]: string; } = {
            products: 'productId',
            categories: 'categoryId',
            carts: 'cartId',
            users: 'userId',
            orders: 'orderId',
            banners: 'bannerId',
            // Add more mappings as needed
        };

        const idField = idFieldMapping[resource] || 'id';

        const query = {
            pageNumber: page.toString(),
            pageSize: perPage.toString(),
            sortBy: field === 'id' ? idField : field,
            sortOrder: order,
            ...filter,
        };
        console.log('Requesting filters:', filter);
        console.log('User email: ', localStorage.getItem('username'));
        console.log('User pass: ', localStorage.getItem('password'));
        console.log('User token: ', localStorage.getItem('jwt-token'));
        let url: string;
        if (filter && filter.search) {
            const keyword = filter.search;
            delete query.search;
            url = `${apiUrl}/public/${resource}/keyword/${encodeURIComponent(keyword)}?${new URLSearchParams(query).toString()}`;
        } else if (filter && filter.categoryId) {
            const categoryId = filter.categoryId;
            delete query.categoryId;
            url = `${apiUrl}/public/categories/${categoryId}/${resource}?${new URLSearchParams(query).toString()}`;
        } else {
            // Use public endpoints for read-only resources so non-admin users won't get 401
            if (resource === "carts") {
                url = `${apiUrl}/admin/${resource}?${new URLSearchParams(query).toString()}`;
            } else if (resource === "products" || resource === "categories" || resource === "banners") {
                url = `${apiUrl}/public/${resource}?${new URLSearchParams(query).toString()}`;
            } else {
                url = `${apiUrl}/admin/${resource}?${new URLSearchParams(query).toString()}`;
            }
        }

        console.log('Request URL:', url);

        return httpClient.get(url).then(({ json }) => {
            console.debug('Raw API response for', resource, url, json);
            const baseUrl = 'http://localhost:8080/api/public/products/image/';

            // Support both paginated responses ({ content, totalElements }) and plain arrays ([])
            let items: any[] = [];
            if (json == null) {
                console.warn('Empty response for', url);
                items = [];
            } else if (Array.isArray(json)) {
                items = json;
            } else if (json.content && Array.isArray(json.content)) {
                items = json.content;
            } else {
                // Unexpected shape, try to coerce
                console.warn('Unexpected response shape for', url, json);
                items = [];
            }

            const data = items.map((item: any) => {
                // Normalize category to predictable shape so UI can read category.categoryName
                let category = item.category;
                if (category == null && (item.categoryId || item.categoryName)) {
                    category = {
                        categoryId: item.categoryId || item.id,
                        categoryName: item.categoryName || item.name || item.title
                    };
                } else if (typeof category !== 'object') {
                    category = {
                        categoryId: category,
                        categoryName: category
                    };
                }

                let products = item.products;
                if (resource === "carts" && Array.isArray(products)) {
                    products = products.map((product: any) => ({
                        ...product,
                        id: product.productId,
                        image: product.image ? `${baseUrl}${product.image}` : null
                    }));
                }

                let imageBaseUrl = 'http://localhost:8080/api/public/products/image/';
                if (resource === 'banners') {
                    imageBaseUrl = 'http://localhost:8080/api/public/banners/image/';
                } else if (resource === 'categories') {
                    imageBaseUrl = 'http://localhost:8080/api/public/categories/image/';
                }

                return {
                    id: item[idField],
                    ...item,
                    category,
                    products,
                    image: item.image ? `${imageBaseUrl}${item.image}` : null
                };
            });
            console.log('data list: ', data);

            const total = (json && typeof json.totalElements === 'number') ? json.totalElements : items.length;

            return {
                data,
                total
            };
        });
    },

    delete: async <RecordType extends RaRecord = any>(resource: string, params: DeleteParams<RecordType>): Promise<DeleteResult<RecordType>> => {
        try {
            const url = `${apiUrl}/admin/${resource}/${params.id}`;

            await httpClient.delete(url, {
                data: { ids: [params.id], },
            });

            return {
                data: params.previousData as RecordType,
            };
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Error deleting record');
        }
    },

    deleteMany: async <RecordType extends RaRecord = any>(resource: string, params: DeleteManyParams): Promise<DeleteManyResult<RecordType>> => {
        const { ids } = params;

        try {
            const deletePromises = ids.map(id => {
                const url = `${apiUrl}/admin/${resource}/${id}`;
                return httpClient.delete(url, {
                    data: { ids: [id], },
                });
            });

            await Promise.all(deletePromises);

            return { data: ids };
        } catch (error) {
            console.error('API request failed:', error);
            throw new Error('Error deleting records');
        }
    },

    getManyReference: function <RecordType extends RaRecord = any>(resource: string, params: GetManyReferenceParams & QueryFunctionContext): Promise<GetManyReferenceResult<RecordType>> {
        throw new Error('Function not implemented.');
    },

    updateMany: function <RecordType extends RaRecord = any>(resource: string, params: UpdateManyParams): Promise<UpdateManyResult<RecordType>> {
        throw new Error('Function not implemented.');
    },

    create: async (resource: string, params: CreateParams): Promise<CreateResult> => {
        try {
            console.log("data", params);
            let url: string;
            if (resource === "products") {
                url = `${apiUrl}/admin/categories/${params.data.categoryId}/${resource}`;
                delete params.data.categoryId;
                params.data.image = 'default.png';
            } else if (resource === "categories") {
                // Backend expects POST /api/admin/category (singular) for creating a category
                url = `${apiUrl}/admin/category`;
            } else {
                url = `${apiUrl}/admin/${resource}`;
            }

            const { data } = params;
            const result = await httpClient.post(url, data);
            return { data: { ...data, id: result.json.id } };
        } catch (error) {
            console.error("Error creating resource:", error);
            throw error; // Hoặc xử lý lỗi tùy theo nhu cầu của bạn
        }
    },

    update: async (resource: string, params: UpdateParams): Promise<UpdateResult> => {
        let url: string;
        let { data } = params;

        if (resource === 'orders') {
            const email = data.email || localStorage.getItem("globalEmailCart") || "";
            const status = data.orderStatus || "";
            url = `${apiUrl}/admin/users/${email}/orders/${params.id}/orderStatus/${encodeURIComponent(status)}`;
        } else if (resource === 'users') {
            url = `${apiUrl}/public/${resource}/${params.id}`;
        } else {
            url = `${apiUrl}/admin/${resource}/${params.id}`;
        }

        // If updating a product, ensure we send nested category object so backend can update it
        if (resource === 'products' && data && (data as any).categoryId) {
            const categoryId = (data as any).categoryId;
            data = { ...data, category: { categoryId } };
            // optionally remove top-level categoryId to avoid confusion
            delete (data as any).categoryId;
        }

        const result = await httpClient.put(url, data);
        const updatedData = {
            id: params.id, // Ensure 'id' is included in the response
            ...result.json
        };


        return { data: updatedData };
    },

    getOne: async (resource: string, params: GetOneParams): Promise<GetOneResult> => {
        console.log('Getone called for resouce:', resource, 'with params:', params);
        let url: string;
        if (resource === "carts") {
            url = `${apiUrl}/admin/${resource}/${params.id}`;
        } else if (resource === "orders") {
            const email = params.meta?.email || localStorage.getItem("globalEmailCart") || "";
            url = `${apiUrl}/public/users/${email}/orders/${params.id}`;
        } else {
            url = `${apiUrl}/public/${resource}/${params.id}`;
        }
        const result = await httpClient.get(url);
        console.log("API Response: ", result.json);

        const idFieldMapping: { [key: string]: string } = {
            products: 'productId',
            categories: 'categoryId',
            carts: 'cartId',
            users: 'userId',
            orders: 'orderId',
            banners: 'bannerId',
            // Add more mappings as needed
        };
        const idField = idFieldMapping[resource] || 'id';
        const baseUrl = 'http://localhost:8080/api/public/products/image/';
        let data;

        if (resource === "carts") {
            data = {
                id: result.json[idField],
                totalPrice: result.json.totalPrice,
                products: result.json.products.map((product: any) => ({
                    id: product.productId,
                    productName: product.productName,
                    image: product.image ? `${baseUrl}${product.image}` : null,
                    description: product.description,
                    quantity: product.quantity,
                    price: product.price,
                    discount: product.discount,
                    specialPrice: product.specialPrice,
                    category: product.category ? {
                        id: product.category.categoryId,
                        name: product.category.categoryName
                    } : null,
                }))
            };
        } else if (resource === "orders") {
            data = {
                id: result.json[idField],
                ...result.json,
                orderItems: result.json.orderItems ? result.json.orderItems.map((item: any) => {
                    const product = item.product;
                    return {
                        ...item,
                        product: product ? {
                            ...product,
                            image: product.image ? `${baseUrl}${product.image}` : null
                        } : null
                    };
                }) : []
            };
        }
        else {
            let imageBaseUrl = 'http://localhost:8080/api/public/products/image/';
            if (resource === 'banners') {
                imageBaseUrl = 'http://localhost:8080/api/public/banners/image/';
            } else if (resource === 'categories') {
                imageBaseUrl = 'http://localhost:8080/api/public/categories/image/';
            }
            data = {
                id: result.json[idField],
                ...result.json,
                image: result.json.image ? `${imageBaseUrl}${result.json.image}` : null
            };
        }
        return { data };
    },

    getMany: async (resource: string, params: GetManyParams): Promise<GetManyResult> => {
        const idFieldMapping: { [key: string]: string } = {
            products: 'productId',
            categories: 'categoryId',
            carts: 'cartId',
            users: 'userId',
            orders: 'orderId',
            banners: 'bannerId',
            // Add more mappings as needed
        };
        console.log('Request resource:', resource);
        console.log('params:', params);
        const idField = idFieldMapping[resource] || 'id';

        const ids = params.ids.join(',');
        let url: string;
        if (resource === "products") {
            url = `${apiUrl}/public/categories/${ids}/${resource}`;
        } else {
            url = `${apiUrl}/public/${resource}`;
        }

        console.log('Request URL getMany:', url);

        const result = await httpClient.get(url);
        console.log('Request result:', result);
        console.log('Request result JSON:', result.json);

        let items: any[] = [];
        if (result.json == null) {
            items = [];
        } else if (Array.isArray(result.json)) {
            items = result.json;
        } else if (result.json.content && Array.isArray(result.json.content)) {
            items = result.json.content;
        } else {
            console.warn('Unexpected getMany response shape:', result.json);
            items = [];
        }

        const data = items.map((item: any) => ({
            id: item[idField],
            ...item,
        }));

        return { data };
    },
};
