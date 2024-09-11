import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { CreateOrganisationActionButtons } from '@common/global-ui-components/createOrganisation/components/CreateOrganisationActionButtons';
import { organisationDetailsFormFields } from '@common/global-ui-components/createOrganisation/utils/form';
import { Form } from 'antd';

export const OrganisationDetailForm = () => {
	const { onChangeOrganisationDetails } = useOrganisationContext();
	return (
		<div>
			<Form onFinish={(values) => onChangeOrganisationDetails({ name: values.name, description: values.description })}>
				{organisationDetailsFormFields.map((field) => (
					<Form.Item
						key={field.name}
						label={field.label}
						name={field.name}
						rules={field.rules}
					>
						{field.input}
					</Form.Item>
				))}
				<CreateOrganisationActionButtons loading={false} />
			</Form>
		</div>
	);
};
