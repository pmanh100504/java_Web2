import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput, required } from "react-admin";

const validateCategoryName = [required(), (value: any) => (value && value.length < 5) ? 'Category name must contain at least 5 characters' : undefined];

export const CategoryList = () => (
    <List>
        <Datagrid>
            <TextField source="categoryId" label="Category ID" />
            <TextField source="categoryName" label="Category Name" />
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
        </SimpleForm>
    </Edit>
);