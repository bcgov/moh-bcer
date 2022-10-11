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