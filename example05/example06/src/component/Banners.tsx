import { List, Datagrid, TextField, DeleteButton, EditButton, Create, Edit, SimpleForm, TextInput, useRecordContext, SelectInput } from "react-admin";
import { Link as RouterLink } from "react-router-dom";

const CustomImageField = ({ source } : { source: string }) => {
    const record = useRecordContext();

    if (!record) return null;

    const imgVal = record[source];
    const hasImage = imgVal && !imgVal.includes('default.png');

    return (
        <RouterLink to={`/banners/${record.id}/update-image`} style={{ textDecoration: 'none' }}>
            {hasImage ? (
                <img src={imgVal} alt="Banner" style={{ width: '150px', height: 'auto', borderRadius: '4px', border: '1px solid #ddd' }} />
            ) : (
                <span style={{ color: '#2563eb', fontWeight: '800', textDecoration: 'underline', cursor: 'pointer' }}>Tải ảnh lên</span>
            )}
        </RouterLink>
    );
};

export const BannerList = () => (
    <List>
        <Datagrid rowClick={false}>
            <TextField source="bannerId" label="Banner ID" />
            <TextField source="title" label="Title" />
            <TextField source="subtitle" label="Subtitle" />
            <CustomImageField source="image" />
            <TextField source="link" label="Link" />
            <TextField source="type" label="Type" />
            <TextField source="background" label="Background (CSS)" />
            <TextField source="info" label="Info" />
            <EditButton />
            <DeleteButton />
        </Datagrid>
    </List>
);

export const BannerCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" label="Title" />
            <TextInput source="subtitle" label="Subtitle" />
            <TextInput source="link" label="Link" />
            <SelectInput source="type" label="Type" choices={[
                { id: 'MAIN', name: 'MAIN (Big Left Column)' },
                { id: 'SUB_TOP', name: 'SUB_TOP (Right Upper)' },
                { id: 'SUB_BOTTOM', name: 'SUB_BOTTOM (Right Lower)' },
            ]} defaultValue="MAIN" />
            <TextInput source="background" label="Background (Hex or CSS gradient)" defaultValue="linear-gradient(135deg, #09152b 0%, #1e3a8a 100%)" />
            <TextInput source="info" label="Info (e.g. Address | Phone)" />
        </SimpleForm>
    </Create>
);

export const BannerEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="bannerId" disabled />
            <TextInput source="title" label="Title" />
            <TextInput source="subtitle" label="Subtitle" />
            <TextInput source="image" disabled />
            <TextInput source="link" label="Link" />
            <SelectInput source="type" label="Type" choices={[
                { id: 'MAIN', name: 'MAIN (Big Left Column)' },
                { id: 'SUB_TOP', name: 'SUB_TOP (Right Upper)' },
                { id: 'SUB_BOTTOM', name: 'SUB_BOTTOM (Right Lower)' },
            ]} />
            <TextInput source="background" label="Background (Hex or CSS gradient)" />
            <TextInput source="info" label="Info (e.g. Address | Phone)" />
        </SimpleForm>
    </Edit>
);
