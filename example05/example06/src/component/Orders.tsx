import React from 'react';
import { List, useRedirect, useNotify, useRefresh, useRecordContext, ReferenceField, TextField, Show, SimpleShowLayout, NumberField, ArrayField, ImageField, Datagrid, Identifier } from 'react-admin';
import PDFButton from '../PDFButton'; // Assuming you have a PDFButton component
import { Edit, SimpleForm, SelectInput, TextInput } from 'react-admin';

// Custom PDF button component for Orders
const CustomOrderPDFButton = () => {
    const record = useRecordContext();

    if (!record) {
        return <span>Loading...</span>;
    }

    if (!record.id) {
        return <span>No order ID</span>;
    }

    return <PDFButton cartId={record.id} type="orders" />;
};

// Orders List component
export const OrderList = () => {
    const redirect = useRedirect();

    const handleRowClick = (id: Identifier | undefined, resource: string | undefined, record: { email: string; }) => {
        if (id) {
            localStorage.setItem('globalCartId', id.toString());
            localStorage.setItem('globalResponse', 'orders');
            
        }
        localStorage.setItem("globalEmailCart", record.email);
        redirect('show', resource, id);
    };

    return (
        <List>
            <Datagrid rowClick={handleRowClick}>
                <TextField source="orderId" label="Order ID" />
                <NumberField source="totalAmount" label="Total Amount" />
                <TextField source="email" label="Email" />
                <TextField source="orderStatus" label="Status" />
            </Datagrid>
        </List>
    );
};

// Orders Show component to display details
export const OrderShow = () => {
    const notify = useNotify();
    const refresh = useRefresh();
    const redirect = useRedirect();

    const onError = (error: { message: any; }) => {
        notify(`Could not load order: ${error.message}`, { type: 'error' });
        redirect('/orders');
        refresh();
    };

    if (!localStorage.getItem("globalEmailCart")) {
        return <span>Error: Email is required</span>;
    }

    return (
        <Show
            queryOptions={{
                meta: { email: localStorage.getItem("globalEmailCart") },
                onError,
            }}
        >
            <SimpleShowLayout>
                <CustomOrderPDFButton />
                <TextField source="orderId" label="Order ID" />
                <NumberField source="totalAmount" label="Total Amount" />
                <TextField source="orderStatus" label="Order Status" />
                <ArrayField source="orderItems" label="Products">
                    <Datagrid>
                        <TextField source="product.productId" label="Product ID" />
                        <TextField source="product.productName" label="Product Name" />
                        <ImageField source="product.image" label="Image" />
                        <TextField source="product.description" label="Description" />
                        <NumberField source="quantity" label="Ordered Quantity" />
                        <NumberField source="product.price" label="Price" />
                        <NumberField source="product.discount" label="Discount" />
                        <NumberField source="product.specialPrice" label="Special Price" />
                        <ReferenceField source="product.category.categoryId" reference="categories" label="Category">
                            <TextField source="categoryName" />
                        </ReferenceField>
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    );
};

// Order Edit component to update order status
export const OrderEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="id" disabled label="Order ID" />
            <TextInput source="email" disabled label="Email" />
            <SelectInput source="orderStatus" label="Order Status" choices={[
                { id: 'Order Accepted!', name: 'Order Accepted!' },
                { id: 'Shipped', name: 'Shipped' },
                { id: 'Delivered', name: 'Delivered' },
                { id: 'Cancelled', name: 'Cancelled' }
            ]} />
        </SimpleForm>
    </Edit>
);
