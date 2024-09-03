import { ECreateOrganisationSteps } from '@common/enum/substrate';
import { CreateOrganisationActionButtons } from '@common/global-ui-components/createOrganisation/components/CreateOrganisationActionButtons';
import { organisationDetailsFormFields } from '@common/global-ui-components/createOrganisation/utils/form';
import { Form } from 'antd';
import { useState } from 'react';

export const OrganisationDetailForm = () => {
	const [step, setStep] = useState(ECreateOrganisationSteps.ORGANISATION_DETAILS);
	const handleUpdateStep = (newStep: ECreateOrganisationSteps) => {
		setStep(newStep);
	};
	return (
		<div>
			<Form onFinish={() => {}}>
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
				<CreateOrganisationActionButtons
					step={step}
					loading={false}
					onStepUpdate={handleUpdateStep}
				/>
			</Form>
		</div>
	);
};
