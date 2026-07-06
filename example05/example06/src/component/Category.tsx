import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput, required, useRecordContext } from "react-admin";
import { Link as RouterLink } from "react-router-dom";

const validateCategoryName = [required(), (value: any) => (value && value.length < 5) ? 'Category name must contain at least 5 characters' : undefined];

const CustomImageField = ({ source } : { source: string }) => {
    const record = useRecordContext();

    if (!record) return null;

    const imgVal = record[source];
    const hasImage = imgVal && !imgVal.includes('default.png');

    return (
        <RouterLink to={`/categories/${record.id}/update-image`} style={{ textDecoration: 'none' }}>
            {hasImage ? (
                <img src={imgVal} alt="Category Banner" style={{ width: '150px', height: 'auto', borderRadius: '4px', border: '1px solid #ddd' }} />
            ) : (
                <span style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}>Tải ảnh lên</span>
            )}
        </RouterLink>
    );
};

export const CategoryList = () => (
    <List>
        <Datagrid rowClick={false}>
            <TextField source="categoryId" label="Category ID" />
            <TextField source="categoryName" label="Category Name" />
            <CustomImageField source="image" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const CategoryCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="categoryName" label="Category Name" validate={validateCategoryName} />
        </SimpleForm>
    </Create>
);

export const CategoryEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="categoryId" label="Category ID" disabled />
            <TextInput source="categoryName" label="Category Name" validate={validateCategoryName} />
            <TextInput source="image" disabled />
        </SimpleForm>
    </Edit>
);