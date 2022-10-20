export const locationTypeOptions = (includeAll: boolean = false) => {
    let locationTypes =  [
        { value: 'physical', label: 'Physical' },
        { value: 'online', label: 'Online' },
        { value: 'both', label: 'Online and Physical' }
    ];

    if (includeAll)
        locationTypes.unshift({ value: 'all', label: 'All' });

    return locationTypes; 
}

export const reportingStatusOptions = (hasNotRequired: boolean = false) => {
    let reportingStatusOption =  [
        { value: 'all', label: 'All' },
        { value: 'Submitted', label: 'Submitted' },
        { value: 'NotSubmitted', label: 'Not Submitted' },
    ];

    if (hasNotRequired)
        reportingStatusOption.push({ value: 'NotRequired', label: 'Not Required' });

    return reportingStatusOption; 
}