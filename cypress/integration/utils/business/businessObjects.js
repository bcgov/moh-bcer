export const businessInputErrorMessage = {
  legalName: {
    length: "The business legal name must be less than 100 characters.",
  },
  businessName: {
    length: "The business name must be less than 100 characters.",
  },
  addressLine1: {
    length: "The address must be less than 100 characters.",
  },
  addressLine2: {
    length: "The address must be less than 100 characters.",
  },
  city: {
    length: "The city must be less than 50 characters.",
  },
  postal: {
    valid: "Please provide a valid postal code",
    required: "Postal code is a required field",
  },
  phone: {
    valid: "Please provide a valid phone number",
    required: "A phone number is required",
  },
  email: {
    valid: "Invalid email",
    required: "Email is a required field",
  },
  webPage: {
    length: "The URL must be less than 100 characters.",
  },
};

export const businessFieldNames = {
  legalName: 'input[name="legalName"]',
  businessName: 'input[name="businessName"]',
  addressLine1: 'input[name="addressLine1"]',
  addressLine2: 'input[name="addressLine2"]',
  city: 'input[name="city"]',
  postal: 'input[name="postal"]',
  phone: 'input[name="phone"]',
  email: 'input[name="email"]',
  webPage: 'input[name="webpage"]',
};

export const businessInfo = {
  legalName: "Test business legal name",
  businessName: "Test business name",
  addressLine1: "Test address line 1",
  addressLine2: "Test address line 2",
  city: "Test city",
  postal: "a0a0a0",
  phone: '0000000000',
  email: 'test@test.com',
  webPage: 'www.test.com',
}
