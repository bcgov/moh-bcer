export const locationErrorMessages = {
  addressLine1: {
    required: "The address of your place of business is required",
    valid: "Address couldn't be found or is incorrect"
  },
  email: {
    valid: "Invalid Email",
    required: "Email is a required field",
  },
  phone: {
    valid: "Please provide a valid phone number",
    required: "A Phone number is required",
  },
  webpage: {
    valid: "Please provide a valid business webpage",
    required: "Please provide business URL",
  },
  postal: {
    valid: "Please provide a valid postal code",
    required: "Postal Code is a required field",
  },
  doingBusinessAs: {
    length: "The business name must be less than 100 characters."
  },
  underage: {
    required: "This is a required field",
  },
  underageOther: {
    required: "Please provide details",
  },
  healthAuthority: {
    required: "Please select your Health Authority",
  },
  healthAuthorityOther: {
    required: "Please provide details",
  },
  manufacturing: {
    required: "This is a required field"
  }
};

export const locationFieldNames = {
  locationType: {
    physical: 'input[name="location_type"][type="radio"][value="physical"]',
    online: 'input[name="location_type"][type="radio"][value="online"]',
    both: 'input[name="location_type"][type="radio"][value="both"]',
  },
  addressLine1: 'input[name="addressLine1"][type="search"]',
  email: 'input[name="email"]',
  phone: 'input[name="phone"]',
  city: 'input[name="city"]',
  postal: 'input[name="postal"]',
  doingBusinessAs: 'input[name="doingBusinessAs"]',
  underage: {
    yes: 'input[name="underage"][type="radio"][value="Yes"]',
    no: 'input[name="underage"][type="radio"][value="No"]',
    other: 'input[name="underage"][type="radio"][value="other"]',
  },
  underageOther: 'input[name="underage_other"]',
  healthAuthority: {
    fraser: 'input[name="health_authority"][value="fraser"]',
    interior: 'input[name="health_authority"][value="interior"]',
    island: 'input[name="health_authority"][value="island"]',
    northern: 'input[name="health_authority"][value="northern"]',
    coastal: 'input[name="health_authority"][value="coastal"]',
    other: 'input[name="health_authority"][value="other"]',
  },
  healthAuthorityOther: 'input[name="health_authority_other"]',
  manufacturing: {
    yes: 'input[name="manufacturing"][value="yes"]',
    no: 'input[name="manufacturing"][value="no"]'
  },
  webpage: 'input[name="webpage"]',
};

export const exampleManualLocations = [
  {
    addressLine1: "1200 Bl",
    email: "location1@test.com",
    phone: "1111111111",
    postal: "j0j0j0",
    doingBusinessAs: "",
    underage: "yes",
    healthAuthority: "fraser",
    manufacturing: "yes",
  },
  {
    addressLine1: "1100 Blan",
    email: "location2@test.com",
    phone: "2222222222",
    postal: "k0k0k0",
    doingBusinessAs: "",
    underage: "no",
    healthAuthority: "other",
    healthAuthorityOther: "Test health authority",
    manufacturing: "no",
  }
]
