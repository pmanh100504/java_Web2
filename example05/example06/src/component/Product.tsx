import { Create, Datagrid, DeleteButton, Edit, EditButton, List, NumberField, NumberInput, ReferenceInput, SelectInput, SimpleForm, TextField, TextInput, useRecordContext, required, FunctionField } from "react-admin";
import {Link as RouterLink} from "react-router-dom";
const CustomImageField = ({ source }:{source:string}) => {
    const record = useRecordContext();

    if (!record) return null;

    const imgVal = record[source];
    const hasImage = imgVal && !imgVal.includes('default.png');

    return (
        <RouterLink to={`/products/${record.id}/update-image`} style={{ textDecoration: 'none' }}>
            {hasImage ? (
                <img src={imgVal} alt="Product" style={{ width: '100px', height: 'auto' }} />
            ) : (
                <span style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}>Tải ảnh lên</span>
            )}
        </RouterLink>
    );
};
const postFilters = [
    <TextInput source="search" label="Search" alwaysOn />,
    <ReferenceInput source="categoryId" reference="categories" label="Category">
        <SelectInput optionText="categoryName" optionValue="categoryId" />
    </ReferenceInput>
];

const validateProductName = [required(), (value: any) => (value && value.length < 3) ? 'Product name must contain at least 3 characters' : undefined];
const validateDescription = [required(), (value: any) => (value && value.length < 6) ? 'Description must contain at least 6 characters' : undefined];
const validateCategory = [required()];
const validateQuantity = [required()];
const validatePrice = [required()];
export const ProductList = () => (
    <List filters={postFilters}>
        <Datagrid rowClick={false}>
            <TextField source="productId" label="Product ID" />
            <TextField source="productName" label="Product Name" />
            <FunctionField label="Category Name" render={record => (
                record?.category?.categoryName || record?.categoryName || (record?.category && typeof record.category === 'object' ? record.category.categoryName : record?.category) || ''
            )} />
            <CustomImageField source="image" />
            <TextField source="description" label="Description" />
            <NumberField source="quantity" label="Quantity" />
            <NumberField source="price" label="Price" />
            <NumberField source="discount" label="Discount" />
            <NumberField source="specialPrice" label="Special Price" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);
export const ProductCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="productName" label="Product Name" validate={validateProductName} />
            <TextInput source="description" label="Description" validate={validateDescription} />
            <NumberInput source="quantity" label="Quantity" validate={validateQuantity} />
            <NumberInput source="price" label="Price" validate={validatePrice} />
            <NumberInput source="discount" label="Discount" />
            <NumberInput source="specialPrice" label="Special Price" />
            <ReferenceInput source="categoryId" reference="categories" label="Category">
                <SelectInput optionText="categoryName" optionValue="categoryId" validate={validateCategory} />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
export const ProductEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="productId" disabled />
            <ReferenceInput source="categoryId" reference="categories" label="Category">
                <SelectInput optionText="categoryName" optionValue="categoryId" />
            </ReferenceInput>
            <TextInput source="productName" />
            <TextInput source="image" disabled />
            <TextInput source="description" />
            <NumberInput source="quantity" />
            <NumberInput source="price" />
            <NumberInput source="discount" />
            <NumberInput source="specialPrice" />
        </SimpleForm>
    </Edit>
);
