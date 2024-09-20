// export const ERROR_CODES = {
// API_FETCH_ERROR: 'API_FETCH_ERROR',
// INVALID_PARAMS_ERROR: 'INVALID_PARAMS_ERROR',
// INVALID_SEARCH_PARAMS_ERROR: 'INVALID_SEARCH_PARAMS_ERROR',
// REQ_BODY_ERROR: 'REQ_BODY_ERROR',
// CLIENT_ERROR: 'CLIENT_ERROR',
// POST_NOT_FOUND_ERROR: 'POST_NOT_FOUND_ERROR',
// ADDRESS_NOT_FOUND_ERROR: 'ADDRESS_NOT_FOUND_ERROR',
// USER_NOT_FOUND_ERROR: 'USER_NOT_FOUND_ERROR',
// INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
// UNAUTHORIZED: 'UNAUTHORIZED',
// NOT_FOUND: 'NOT_FOUND',
// BAD_REQUEST: 'BAD_REQUEST',
// MISSING_REQUIRED_FIELDS: 'MISSING_REQUIRED_FIELDS',
// INVALID_REQUIRED_FIELDS: 'INVALID_REQUIRED_FIELDS',
// INVALID_TRANSACTION: 'INVALID_TRANSACTION',
// TRANSACTION_FAILED: 'TRANSACTION_FAILED'
// };

import { NotificationStatus } from '@common/enum/substrate';

// export const ERROR_MESSAGES = {
// [ERROR_CODES.API_FETCH_ERROR]: 'Something went wrong while fetching data. Please try again later.',
// [ERROR_CODES.INVALID_PARAMS_ERROR]: 'Invalid parameters passed to the url.',
// [ERROR_CODES.INVALID_SEARCH_PARAMS_ERROR]: 'Invalid parameters passed to the url.',
// [ERROR_CODES.REQ_BODY_ERROR]: 'Something went wrong while parsing the request body.',
// [ERROR_CODES.CLIENT_ERROR]: 'Something went wrong while fetching data on the client. Please try again later.',
// [ERROR_CODES.POST_NOT_FOUND_ERROR]: 'Post not found.',
// [ERROR_CODES.ADDRESS_NOT_FOUND_ERROR]: 'Address not found.',
// [ERROR_CODES.USER_NOT_FOUND_ERROR]: 'User not found.',
// [ERROR_CODES.INTERNAL_SERVER_ERROR]: 'Something went wrong on the server. Please try again later.',
// [ERROR_CODES.UNAUTHORIZED]: 'Unauthorized request.',
// [ERROR_CODES.NOT_FOUND]: 'Resource not found.',
// [ERROR_CODES.BAD_REQUEST]: 'Bad request.',
// [ERROR_CODES.MISSING_REQUIRED_FIELDS]: 'Missing required fields.',
// [ERROR_CODES.INVALID_REQUIRED_FIELDS]: 'Invalid required fields.',
// [ERROR_CODES.INVALID_TRANSACTION]: 'Invalid transaction.',
// [ERROR_CODES.TRANSACTION_FAILED]: 'Transaction failed.'
// };

export const ERROR_MESSAGES = {
	TRANSACTION_FAILED: {
		message: 'Transaction failed',
		description: 'Transaction failed to send',
		status: NotificationStatus.ERROR
	},
	CREATE_MULTISIG_FAILED: {
		message: 'Create Multisig failed',
		description: 'Create Multisig failed',
		status: NotificationStatus.ERROR
	},
	LINKED_MULTISIG_FAILED: {
		message: 'Link Multisig failed',
		description: 'Link Multisig failed',
		status: NotificationStatus.ERROR
	},
	CREATE_ORGANISATION_FAILED: {
		message: 'Create Organisation failed',
		description: 'Create Organisation failed',
		status: NotificationStatus.ERROR
	},
	INVALID_ADDRESS: {
		message: 'Invalid Address',
		description: 'Address is invalid',
		status: NotificationStatus.ERROR
	},
	UPDATE_MULTISIG_FAILED: {
		message: 'Update Multisig failed',
		description: 'Update Multisig failed',
		status: NotificationStatus.ERROR
	},
	ADD_ADDRESS_FAILED: {
		message: 'Add Address failed',
		description: 'Address failed to add',
		status: NotificationStatus.ERROR
	},
	REMOVE_ADDRESS_FAILED: {
		message: 'Remove Address failed',
		description: 'Address failed to remove',
		status: NotificationStatus.ERROR
	},
	CREATE_PROXY_FAILED: {
		message: 'Create Proxy failed',
		description: 'Create Proxy failed',
		status: NotificationStatus.ERROR
	}
};

export const SUCCESS_MESSAGES = {
	TRANSACTION_SUCCESS: {
		message: 'Transaction Success',
		description: 'Transaction has been sent successfully',
		status: NotificationStatus.SUCCESS
	},
	CREATE_MULTISIG_SUCCESS: {
		message: 'Create Multisig Success',
		description: 'Create Multisig has been sent successfully',
		status: NotificationStatus.SUCCESS
	},
	LINKED_MULTISIG_SUCCESS: {
		message: 'Link Multisig Success',
		description: 'Link Multisig has been sent successfully',
		status: NotificationStatus.SUCCESS
	},
	CREATE_ORGANISATION_SUCCESS: {
		message: 'Create Organisation Success',
		description: 'Create Organisation has been sent successfully',
		status: NotificationStatus.SUCCESS
	},
	ADD_ADDRESS_SUCCESS: {
		message: 'Add Address Success',
		description: 'Address has been added successfully',
		status: NotificationStatus.SUCCESS
	},
	REMOVE_ADDRESS_SUCCESS: {
		message: 'Remove Address Success',
		description: 'Address has been removed successfully',
		status: NotificationStatus.SUCCESS
	},
	UPDATE_MULTISIG_SUCCESS: {
		message: 'Update Multisig Success',
		description: 'Update Multisig has been sent successfully',
		status: NotificationStatus.SUCCESS
	},
	CREATE_PROXY_SUCCESS: {
		message: 'Create Proxy Success',
		description: 'Create Proxy has been sent successfully',
		status: NotificationStatus.SUCCESS
	}
};

export const INFO_MESSAGES = {
	TRANSACTION_IN_BLOCK: {
		message: 'Transaction in Block',
		description: 'Transaction has been sent and is in block',
		status: NotificationStatus.INFO
	}
};
